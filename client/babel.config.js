module.exports = {
    presets: [
        '@babel/env',
        '@babel/preset-typescript'
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-arrow-functions',
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-modules-commonjs',
    ],
};