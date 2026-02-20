import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const DEFAULT_VITE_DEV_PORT = 3002

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production'
  const isComponentBuild = process.env.BUILD_MODE === 'component'

  if (isComponentBuild) {
    return {
      build: {
        lib: {
          entry: path.resolve(__dirname, 'src/App.tsx'),
          name: 'beeDashboard',
          fileName: format => `App.${format === 'es' ? 'js' : 'cjs.js'}`,
          formats: ['es', 'cjs'],
        },
        sourcemap: !isProd,
        minify: false,
        outDir: 'lib',
        rollupOptions: {
          external: ['react', 'react-dom'],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
            },
            assetFileNames: (assetInfo: any) => {
              if (assetInfo.originalFileNames?.includes('style.css') || assetInfo.names?.includes('bee-dashboard.css'))
                return 'App.css'
              return assetInfo.names?.[0] || 'asset'
            },
          },
        },
      },
      plugins: [
        react(),
        dts({
          exclude: ['**/tests/**', 'src/index.tsx'],
          outDir: 'lib',
          entryRoot: 'src',
          tsconfigPath: './tsconfig.lib.json',
        }),
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
      },
    }
  }

  return {
    plugins: [
      react(),
      nodePolyfills({
        include: ['util', 'buffer'],
        globals: {
          Buffer: true,
          global: true,
          process: true,
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss'],
    },
    optimizeDeps: {
      // exclude: [], // add libs for local development, if needed, e.g.: @solarpunkltd/file-manager-lib
    },
    build: {
      outDir: 'build',
      sourcemap: !isProd,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom') || id.includes('@mui') || id.includes('@emotion'))
                return 'vendor-react-mui'
              if (id.includes('ethers') || id.includes('@ethersproject')) return 'vendor-ethers'
              if (id.includes('@ethersphere/bee-js')) return 'vendor-bee-js'
              if (id.includes('notistack')) return 'vendor-notistack'

              // let Vite handle the rest
            }
          },
        },
      },
    },
    server: {
      port: DEFAULT_VITE_DEV_PORT,
      open: true,
    },
    publicDir: 'public',
    assetsInclude: ['**/*.svg'],
  }
})
