import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

const input = 'src/index.ts';
const external = ['react', 'react-dom'];

const plugins = [
    nodeResolve(),
    commonjs(),
    typescript({
        tsconfig: './tsconfig.json',
        declarationDir: './lib',
        declaration: true,
    }),
];

export default defineConfig([
    // ESM build
    {
        input,
        output: {
            file: 'lib/index.js',
            format: 'esm',
            sourcemap: true,
        },
        external,
        plugins,
    },
    // CommonJS build
    {
        input,
        output: {
            file: 'lib/index.cjs',
            format: 'cjs',
            sourcemap: true,
        },
        external,
        plugins,
    },
    // UMD build
    {
        input,
        output: {
            file: 'lib/index.umd.js',
            format: 'umd',
            name: 'PrismaticsReact',
            globals: {
                react: 'React',
                'react-dom': 'ReactDOM',
            },
            sourcemap: true,
        },
        external,
        plugins: [...plugins, terser()],
    },
    // Types
    {
        input,
        output: {
            file: 'lib/index.d.ts',
            format: 'esm',
        },
        external,
        plugins: [dts()],
    },
]);