// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Reanimated 4 moved the plugin into react-native-worklets
      "react-native-worklets/plugin", // MUST be last
    ],
  };
};
