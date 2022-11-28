import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser';
import config from 'sapper/config/rollup.js'
import pkg from './package.json'

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'preventAssignment': false
      }),
      svelte({
        emitCss: true,
        compilerOptions: {
          hydratable: true,
        }
      }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      json({
        exclude: ['node_modules/**'],
        preferConst: true,
        indent: '  ',
        compact: true
      }),
      !dev && terser({
        module: true
      })
    ],

    preserveEntrySignatures: false,
    onwarn,
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'preventAssignment': false
      }),
      svelte({
        compilerOptions: {
          generate: 'ssr',
        }
      }),
      resolve({
        dedupe: ['svelte']
      }),
      commonjs(),
      json({
        exclude: ['node_modules/**'],
        preferConst: true,
        indent: '  ',
        compact: true
      })
    ],
    external: Object.keys(pkg.dependencies).concat(
      require('module').builtinModules || Object.keys(process.binding('natives'))
    ),

    preserveEntrySignatures: 'strict',
    onwarn,
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode),
        'preventAssignment': false
      }),
      commonjs(),
      !dev && terser()
    ],

    preserveEntrySignatures: false,
    onwarn,
  }
}
