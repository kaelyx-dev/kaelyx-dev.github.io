import { defineNuxtModule, addTemplate, addTypeTemplate, addImports, createResolver } from '@nuxt/kit'
import { readFile, readdir } from 'node:fs/promises'
import { resolve } from 'pathe'
import { parseConf } from './runtime/parse'

export interface KvOptions {
  values?: Record<string, unknown>
  files?: string[] // extra .conf paths, relative to the layer declaring them (config/*.conf is loaded automatically)
}

declare module '@nuxt/schema' {
  interface NuxtConfig { kv?: KvOptions }
  interface NuxtHooks {
    'kv:extend': (kv: Record<string, unknown>) => void | Promise<void>
  }
}

export default defineNuxtModule<KvOptions>({
  meta: { name: 'kv', configKey: 'kv' },
  async setup(_merged, nuxt) {
    const { resolve: r } = createResolver(import.meta.url)
    const kv: Record<string, unknown> = {}

    const load = async (path: string) => {
      Object.assign(kv, parseConf(await readFile(path, 'utf8')))
      nuxt.options.watch.push(path) // restart dev server when a .conf changes
    }

    // Every config/*.conf in a directory, alphabetically so later files win predictably
    const loadConfigDir = async (dir: string) => {
      const configDir = resolve(dir, 'config')
      const entries = await readdir(configDir, { withFileTypes: true }).catch(() => [])
      const files = entries.filter(e => e.isFile() && e.name.endsWith('.conf')).map(e => e.name).sort()
      for (const file of files) await load(resolve(configDir, file))
      nuxt.options.watch.push(configDir) // so chokidar picks up .conf files added later
    }

    // Module's own config/ provides the lowest-priority defaults
    await loadConfigDir(r('.'))

    // _layers[0] is the root project, so walk from the deepest layer up and let the root win
    for (const layer of [...nuxt.options._layers].reverse()) {
      const root = layer.config.rootDir ?? layer.cwd
      if (root) await loadConfigDir(root)
      const opts = layer.config.kv as KvOptions | undefined
      if (!opts) continue
      for (const file of opts.files ?? []) await load(resolve(root, file))
      Object.assign(kv, opts.values)
    }

    // String watch entries only match exact paths, so catch new/removed .conf files by pattern
    nuxt.options.watch.push(/(^|\/)config\/[^/]+\.conf$/)

    // Give other modules a chance to contribute once they've all been set up
    nuxt.hook('modules:done', () => nuxt.callHook('kv:extend', kv))

    addTemplate({
      filename: 'kv-defaults.mjs',
      getContents: () => `export default ${JSON.stringify(kv, null, 2)}`,
    })
    addTypeTemplate({
      filename: 'types/kv-defaults.d.ts',
      getContents: () =>
        `declare module '#build/kv-defaults.mjs' { const d: Record<string, unknown>; export default d }`,
    })

    addImports([
      { name: 'useKv', from: r('./runtime/useKv') },
      { name: 'LIST_DELIMITER', from: r('./runtime/useKv') },
      { name: 'parseConf', from: r('./runtime/parse') },
    ])
  },
})