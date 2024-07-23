const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  punycode: require.resolve("punycode/"),
};

module.exports = defaultConfig;
