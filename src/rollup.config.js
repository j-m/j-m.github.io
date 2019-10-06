import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from 'rollup-plugin-json';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'umd',
		name: 'app',
		file: 'public/bundle.js'
	},
	plugins: [
		svelte({
			hydratable: true,
			dev: !production
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),
		json({
      exclude: [ 'node_modules/**' ],
      preferConst: true,
      indent: '  ',
      compact: true
		}),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
