import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

// import pkg from './package.json' assert { type: "json"};

// const name = pkg.name
// 	.replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
// 	.replace(/^\w/, m => m.toUpperCase())
// 	.replace(/-\w/g, m => m[1].toUpperCase());

export default {
	input: 'src/index.ts',
	 output: [
		{ dir: 'dist', 'format': 'es' },
		// { dir: 'dist', 'format': 'umd', name }
	 ],
	plugins: [
		svelte({
			emitCss: false,
			preprocess: autoPreprocess(),
		}),
		resolve(),
		commonjs(),
		typescript({ sourceMap: process.env.NODE_ENV !== 'production' }),
		css({ output: 'bundle.css' }),
	]
};
