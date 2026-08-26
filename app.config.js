import { createRequire } from "module";

const require = createRequire(import.meta.url);

const { withAndroidManifest } = require("@expo/config-plugins");

export default ({ config }) => {
  config = withAndroidManifest(config, (config) => {
    const mainApp = config.modResults.manifest.application[0];
    mainApp["meta-data"] = mainApp["meta-data"] || [];
    mainApp["meta-data"].push({
      $: {
        "android:name": "com.google.android.geo.API_KEY",
        "android:value": process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      },
    });
    return config;
  });

  return {
    ...config,
    ios: {
      ...config.ios,
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
      },
    },
  };
};
