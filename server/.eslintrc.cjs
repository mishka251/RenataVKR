module.exports = {
    plugins: [
       // 'vue',
        '@typescript-eslint',
        'sonarjs',
        'no-use-extend-native',
        'promise'
    ],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        env: { es6: true },
        sourceType: 'module'
    },
    // settings: {
    //     'import/resolver': {
    //         'webpack': {
    //             'config': './client/webpack.config.ts'
    //         }
    //     }
    // },
    root: true,
    env: {
        browser: true,
        node: true,
        serviceworker: true
    },
    extends: [
        //'airbnb-base',
       // 'plugin:vue/base',
        'plugin:@typescript-eslint/recommended',
       // 'plugin:vue/essential',
        'plugin:sonarjs/recommended',
        'plugin:promise/recommended',

        'standard'
    ],

    rules: {
        'one-var': 0,
        'arrow-parens': 0,
        'generator-star-spacing': 0,
        'no-debugger': 0,
        'comma-dangle': ['error', 'always-multiline'],
        'no-console': 0,
        semi: [2, 'always'],
        'no-extra-semi': 2,
        'space-before-function-paren': 0,
        eqeqeq: 0,
        'spaced-comment': 0,
        'no-useless-escape': 0,
        'no-tabs': 0,
        'no-mixed-spaces-and-tabs': 0,
        'new-cap': 0,
        camelcase: 0,
        'no-new': 0,
        indent: 'off',
        // semi: 'off',

        'linebreak-style': 'off',
        'no-underscore-dangle': 'off',
        'import/extensions':'off',
        'max-len':["error", { "code": 120 }],
        'object-shorthand':'off',

        // https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/docs/rules
        '@typescript-eslint/semi': ['error'],
        '@typescript-eslint/indent': 'off',//['error', 4],
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/interface-name-prefix': 'off'
    }
};