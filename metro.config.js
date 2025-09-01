const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Tamagui configuration
config.resolver.unstable_enablePackageExports = true;

// SQLファイルをソースファイルとして扱う（babel-plugin-inline-importで処理）
config.resolver.sourceExts.push('sql');

module.exports = config;
