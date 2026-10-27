// Switches to the Node version in .nvmrc with nvm (if it is installed), then starts `nuxt dev`.
// Supports nvm on macOS/Linux (a shell function, so nvm.sh has to be sourced) and nvm-windows.
import { spawn, spawnSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const nuxtBin = join(root, 'node_modules', 'nuxt', 'bin', 'nuxt.mjs')
const wanted = readFileSync(join(root, '.nvmrc'), 'utf8').trim().replace(/^v/, '')

// Each returns the path of the node binary to run nuxt with, or null if that nvm is not installed
function useNvmUnix() {
  const nvmDir = process.env.NVM_DIR
  if (!nvmDir || !existsSync(join(nvmDir, 'nvm.sh'))) return null

  // nvm reads .nvmrc from the cwd; its output goes to stderr so stdout is only the node path
  const script = '. "$NVM_DIR/nvm.sh" && nvm install 1>&2 && nvm use 1>&2 && command -v node'
  const result = spawnSync('bash', ['-c', script], { cwd: root, stdio: ['inherit', 'pipe', 'inherit'], encoding: 'utf8' })
  if (result.status !== 0) throw new Error('nvm install / nvm use failed')
  return result.stdout.trim()
}

function useNvmWindows() {
  const nvmHome = process.env.NVM_HOME
  if (process.platform !== 'win32' || !nvmHome || !existsSync(join(nvmHome, 'nvm.exe'))) return null

  for (const command of ['install', 'use']) {
    const result = spawnSync(join(nvmHome, 'nvm.exe'), [command, wanted], { cwd: root, stdio: 'inherit' })
    if (result.status !== 0) throw new Error(`nvm ${command} ${wanted} failed`)
  }
  // nvm-windows switches versions by repointing this symlink
  return process.env.NVM_SYMLINK ? join(process.env.NVM_SYMLINK, 'node.exe') : 'node'
}

function nodeVersion(nodeBin) {
  const result = spawnSync(nodeBin, ['--version'], { encoding: 'utf8' })
  return result.status === 0 ? result.stdout.trim().replace(/^v/, '') : null
}

let nodeBin = process.execPath
try {
  nodeBin = useNvmUnix() ?? useNvmWindows() ?? process.execPath
} catch (error) {
  console.warn(`\n[dev] ${error.message}, continuing with the current Node version.\n`)
}

const actual = nodeVersion(nodeBin)
if (actual !== wanted && !actual?.startsWith(`${wanted}.`)) {
  console.warn(`\n[dev] Running Node ${actual ?? 'unknown'}, but .nvmrc asks for ${wanted}.\n`)
}

const child = spawn(nodeBin, [nuxtBin, 'dev', ...process.argv.slice(2)], { cwd: root, stdio: 'inherit' })
child.on('exit', (code) => process.exit(code ?? 0))
