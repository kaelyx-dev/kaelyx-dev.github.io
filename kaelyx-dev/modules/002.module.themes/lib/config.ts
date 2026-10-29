import { err, ok } from '@kaelyx/ts-kit/result'
import type { Result } from '@kaelyx/ts-kit/types'

export type ThemeScheme = 'light' | 'dark'

export interface ThemeConfig {
    default: string
    storageKey: string
    roles: string[]
    system: { follow: boolean, light: string, dark: string }
    labels: Record<string, string>
}

export const THEME_NAME = /^[a-z][a-z0-9-]*$/
const RESERVED = new Set(['system'])
const STORAGE_KEY = /^[\w.:-]+$/

export const checkThemeName = (name: string): Result<string, string> => {
    if (!THEME_NAME.test(name)) return err(`"${name}" is not a valid theme name (lower-case letters, digits and hyphens, starting with a letter)`)
    if (RESERVED.has(name)) return err(`"${name}" is reserved and can't be used as a theme name`)
    return ok(name)
}

const toList = (value: unknown) => String(value ?? '').split(',').map(item => item.trim()).filter(Boolean)

// themes.* keys from kv (the module's own themes.conf, overridden by any config/*.conf) checked against
// the themes that were found, so a typo fails the build instead of shipping a broken default
export const toThemeConfig = (kv: Record<string, unknown>, names: string[]): Result<ThemeConfig, string> => {
    const get = (key: string) => kv[`themes.${key}`] === undefined ? undefined : String(kv[`themes.${key}`]).trim()
    const known = new Set(names)
    const available = names.length ? names.join(', ') : 'none found'

    const follow = get('system.follow') ?? 'true'
    if (follow !== 'true' && follow !== 'false') return err(`themes.system.follow must be true or false, got "${follow}"`)

    const light = get('system.light') ?? 'light'
    const dark = get('system.dark') ?? 'dark'
    const fallback = get('default') || light

    for (const [key, name] of [['system.light', light], ['system.dark', dark], ['default', fallback]] as const) {
        if (!known.has(name)) return err(`themes.${key}: "${name}" is not a theme. Available: ${available}`)
    }

    const storageKey = get('storageKey') ?? 'theme'
    if (!STORAGE_KEY.test(storageKey)) return err(`themes.storageKey "${storageKey}" may only use letters, digits, '_', '.', ':' and '-'`)

    const roles = toList(get('roles'))
    if (!roles.length) return err('themes.roles needs at least one role')
    const badRole = roles.find(role => !THEME_NAME.test(role))
    if (badRole) return err(`themes.roles: "${badRole}" is not a valid role name`)

    const labels: Record<string, string> = {}
    for (const [key, value] of Object.entries(kv)) {
        const name = key.match(/^themes\.label\.(.+)$/)?.[1]
        if (!name) continue
        if (!known.has(name)) return err(`${key}: "${name}" is not a theme. Available: ${available}`)
        labels[name] = String(value)
    }

    return ok({ default: fallback, storageKey, roles, system: { follow: follow === 'true', light, dark }, labels })
}

// "high-contrast" -> "High contrast"
export const toLabel = (name: string) => (name.charAt(0).toUpperCase() + name.slice(1)).replaceAll('-', ' ')

// The mapping decides most schemes; a theme file only needs `$scheme` when it isn't one of the two
export const toScheme = (name: string, declared: ThemeScheme | undefined, config: ThemeConfig): ThemeScheme =>
    declared ?? (name === config.system.dark ? 'dark' : 'light')
