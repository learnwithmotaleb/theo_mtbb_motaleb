const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const ts = require('typescript');
const { configureStore } = require('@reduxjs/toolkit');
const { createApi } = require('@reduxjs/toolkit/query');

function loadTs(relativePath, dependencies) {
  const filename = path.join(__dirname, '..', relativePath);
  const { outputText } = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const module = { exports: {} };
  vm.runInNewContext(outputText, {
    module,
    exports: module.exports,
    require: (name) => dependencies[name] ?? require(name),
  }, { filename });
  return module.exports;
}

function setup(response, saveToken) {
  const slice = loadTs('src/redux/slices/authSlice.ts', {});
  const baseApi = createApi({
    baseQuery: async () => response,
    tagTypes: ['Auth', 'Me'],
    endpoints: () => ({}),
  });
  const { authApi } = loadTs('src/redux/services/authApi.ts', {
    '../api/baseApi': { baseApi, saveToken },
    '../slices/authSlice': slice,
  });
  const store = configureStore({
    reducer: { auth: slice.default, [baseApi.reducerPath]: baseApi.reducer },
    middleware: (getDefault) => getDefault().concat(baseApi.middleware),
  });
  return { store, authApi };
}

for (const role of ['host', 'cleaner']) {
  test(`${role}: login stays pending until persistence and session commit finish`, async () => {
    let releaseSave;
    let notifySaveStarted;
    const saving = new Promise((resolve) => { notifySaveStarted = resolve; });
    const saved = new Promise((resolve) => { releaseSave = resolve; });
    const response = { token: 'test-token', data: { role }, message: 'Signed in' };
    const { store, authApi } = setup({ data: response }, async (token) => {
      assert.equal(token, response.token);
      notifySaveStarted();
      await saved;
    });
    let completed = false;
    const request = store.dispatch(authApi.endpoints.signin.initiate({
      email: 'test@example.com', password: 'test-password',
    }));
    const result = request.unwrap().then((value) => {
      completed = true;
      // This is the point where the login screen navigates into RoleGuard.
      assert.equal(store.getState().auth.token, response.token);
      assert.equal(store.getState().auth.role, role);
      return value;
    });
    await saving;
    await new Promise((resolve) => setTimeout(resolve, 900));
    assert.equal(completed, false, 'must not navigate after the old 800ms delay');
    assert.equal(store.getState().api.mutations[request.requestId].status, 'pending');
    releaseSave();
    assert.equal(await result, response);
    store.dispatch(authApi.util.resetApiState());
  });
}

test('failed login rejects without saving a token or authenticating', async () => {
  let saves = 0;
  const { store, authApi } = setup(
    { error: { status: 401, data: { message: 'Invalid credentials' } } },
    async () => { saves += 1; },
  );
  const request = store.dispatch(authApi.endpoints.signin.initiate({
    email: 'test@example.com', password: 'wrong-password',
  }));
  await assert.rejects(request.unwrap(), (error) => error.status === 401);
  assert.equal(saves, 0);
  assert.equal(store.getState().auth.isAuthenticated, false);
  store.dispatch(authApi.util.resetApiState());
});
