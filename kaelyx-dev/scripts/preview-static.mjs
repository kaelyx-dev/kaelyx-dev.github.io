// Generates the static site, serves it locally the way GitHub Pages would,
// and removes the build output again when the server is stopped (Ctrl+C).
import { spawn } from 'node:child_process'
import { createReadStream } from 'node:fs'
import { rm, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const outputDir = join(root, '.output')
const publicDir = join(outputDir, 'public')
const nuxtBin = join(root, 'node_modules', 'nuxt', 'bin', 'nuxt.mjs')
const port = Number(process.env.PORT) || 3000

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm'
}

let child
let server
let shuttingDown = false

async function cleanup() {
  // `dist` is a symlink to .output/public, so remove it before its target
  await rm(join(root, 'dist'), { recursive: true, force: true })
  await rm(outputDir, { recursive: true, force: true })
  console.log('\nRemoved build output.')
}

async function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  child?.kill()
  server?.close()
  await cleanup()
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

function generate() {
  return new Promise((done, fail) => {
    child = spawn(process.execPath, [nuxtBin, 'generate'], { cwd: root, stdio: 'inherit' })
    child.on('error', fail)
    child.on('exit', (code) => {
      child = undefined
      code === 0 ? done() : fail(new Error(`nuxt generate exited with code ${code}`))
    })
  })
}

async function isFile(path) {
  try {
    return (await stat(path)).isFile()
  } catch {
    return false
  }
}

// Mirrors GitHub Pages: /about -> about.html or about/index.html, unknown paths -> 404.html
async function resolveFile(urlPath) {
  const filePath = resolve(publicDir, '.' + decodeURIComponent(urlPath))
  if (filePath !== publicDir && !filePath.startsWith(publicDir + sep)) return null

  for (const candidate of [filePath, join(filePath, 'index.html'), filePath + '.html']) {
    if (await isFile(candidate)) return candidate
  }
  return null
}

async function serve() {
  server = createServer(async (req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost')
    let file = await resolveFile(pathname)
    let status = 200

    if (!file) {
      status = 404
      file = (await isFile(join(publicDir, '404.html'))) ? join(publicDir, '404.html') : null
    }

    console.log(`${status} ${req.method} ${pathname}`)
    if (!file) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found')
      return
    }

    res.writeHead(status, { 'content-type': mimeTypes[extname(file)] ?? 'application/octet-stream' })
    createReadStream(file).pipe(res)
  })

  await new Promise((done) => server.listen(port, done))
  console.log(`\nServing static build at http://localhost:${port}`)
  console.log('Press Ctrl+C to stop and remove the build output.\n')
}

try {
  await generate()
  await serve()
} catch (error) {
  console.error(error.message)
  await shutdown(1)
}
