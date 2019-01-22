const vue = require('rollup-plugin-vue');
const buble = require('rollup-plugin-buble');
const {terser} = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/vue-diff-component.js',
        name: 'VueDiffView',
        format: 'umd'
    },
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            browser: true
        }),
        commonjs(),
        vue({
            compileTemplate: true,
            css: true
        }),
        buble(),
        terser({
            compress: {
                global_defs: {
                    __DEV__: process.env.NODE_ENV !== 'production'
                }
            }
        })
    ]
};
