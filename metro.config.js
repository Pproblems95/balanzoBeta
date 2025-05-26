// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// SOLUCIÓN CLAVE: Deshabilitar el soporte para package.json 'exports'
// Esto fuerza a Metro a usar la resolución de módulos anterior,
// que es más compatible con algunas librerías que tienen problemas con 'exports'.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;