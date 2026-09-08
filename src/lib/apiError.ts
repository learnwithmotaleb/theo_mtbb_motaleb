// RTK Query surfaces errors as either a FetchBaseQueryError (with the backend's
// JSON envelope in `data`) or a SerializedError. One helper so every screen
// shows the backend's own message instead of "[object Object]".

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string => {
  if (!error) return fallback;

  const err = error as {
    data?: { message?: string; errorMessages?: { message?: string }[] };
    error?: string;
    message?: string;
    status?: number | string;
  };

  const first = err.data?.errorMessages?.[0]?.message;
  if (first) return first;
  if (err.data?.message) return err.data.message;
  if (err.status === 'FETCH_ERROR') return 'Network error — check your connection.';
  if (err.message) return err.message;
  if (typeof err.error === 'string') return err.error;
  return fallback;
};
