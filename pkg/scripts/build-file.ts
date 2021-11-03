import arg from 'arg'
import * as fs from 'fs'
import * as path from 'path'
import type { WatchMode } from 'esbuild'
import { build } from 'esbuild'
import { nodeExternalsPlugin } from 'esbuild-node-externals'

interface Params {
  from: string
  to: string
  watch: boolean
  target: string
}

const main = async ({ from, to, watch, target }: Params) => {
  const fromPath = path.resolve(process.cwd(), from)
  const toPath = path.resolve(process.cwd(), to)
  const toDir = path.dirname(toPath)

  fs.mkdirSync(toDir, { recursive: true })

  const watchOptions: boolean | WatchMode = watch
    ? {
        onRebuild(error) {
          if (!error) return console.error(error)
          console.log('building...')
        },
      }
    : false

  await build({
    platform: 'node',
    format: 'cjs',
    target,
    minify: true,
    keepNames: true,
    sourcemap: 'inline',
    bundle: true,
    outfile: toPath,
    entryPoints: [fromPath],
    watch: watchOptions,
    plugins: [
      nodeExternalsPlugin({
        allowList: [
          '@violet/web',
          '@violet/api',
          '@violet/def',
          '@violet/scripts',
          '@violet/lambda-conv2img',
        ],
      }),
    ],
  })
}

const args = arg({
  '--watch': Boolean,
  '--production': Boolean,
  '--from': String,
  '--to': String,
  '--target': String,
})
main({
  watch: Boolean(args['--watch']),
  from: args['--from'] || '',
  to: args['--to'] || '',
  target: args['--target'] || '',
}).catch((e) => {
  console.error(e)
})
