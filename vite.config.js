import nodePolyfills from 'rollup-plugin-polyfill-node'
import pugPlugin from 'vite-plugin-pug'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { configureInputs } from './vite.utils'

const copyOptions = {
  targets: [
    {
      src: ['./assets/images/*'],
      dest: './assets/images',
    },
  ],
}

const pugOptions = {
  pretty: true,
  localImports: true,
  basedir: resolve(__dirname, 'src'),
}

const pugLocals = {
  baseUrl: '.',
  viewsUrl: '/views',
  imgUrl: '/assets/images',

  $: {
    requireDataPage(page) {
      const context = 'src/views'
      const dirname = resolve(process.cwd(), `${context}/${page}/data.json`)

      return require(dirname)
    },
  },
}

const reactExcludePaths = [
  'src/views/',
  'src/blocks',
  'src/layouts',
  'src/views',
]

export default defineConfig({
  root: 'src',
  plugins: [
    react({ exclude: reactExcludePaths }),
    pugPlugin(pugOptions, pugLocals),
    viteStaticCopy(copyOptions),
    /* mpa(mpaOptions) */
    ,
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@app': resolve(__dirname, 'src/xen-chat'),
      components: resolve(__dirname, 'src/components'),
      layouts: resolve(__dirname, 'src/layouts'),
      views: resolve(__dirname, 'src/views'),
      styles: resolve(__dirname, 'src/styles'),
      images: resolve(__dirname, 'src/assets/images'),
      fonts: resolve(__dirname, 'src/assets/fonts'),
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.pug', '.scss'],
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  css: {
    devSourcemap: true,
  },
  build: {
    manifest: true,
    outDir: resolve(__dirname, 'build'),
    rollupOutputOptions: {
      entryFileNames: `[name].js`,
      chunkFileNames: `[name].js`,
      assetFileNames: `[name].[ext]`,
    },
    rollupOptions: {
      input: {
        app: resolve(__dirname, 'src/index.html'),
        ['xen-chat']: resolve(__dirname, 'src/xen-chat/index.ts'),
        ...configureInputs('src', 'views'),
      },
      plugins: [nodePolyfills()],
    },
  },
})
