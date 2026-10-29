import { readonly } from 'vue'
import { useState } from '#imports'
import { err, ok } from '@kaelyx/ts-kit/result'
import type { Result } from '@kaelyx/ts-kit/types'
import { themeConfig, themeNames, themes, type ThemeMeta, type ThemeName } from '#themes'
import { resolveTheme } from './resolve'

export type ThemePreference = ThemeName | 'system'

const DARK_QUERY = '(prefers-color-scheme: dark)'

export const isThemeName = (value: unknown): value is ThemeName =>
    typeof value === 'string' && Object.hasOwn(themes, value)

export const isThemePreference = (value: unknown): value is ThemePreference =>
    value === 'system' || isThemeName(value)

const readStored = () => {
    try { return localStorage.getItem(themeConfig.storageKey) } catch { return null }
}

const writeStored = (preference: ThemePreference) => {
    try {
        if (preference === 'system') localStorage.removeItem(themeConfig.storageKey)
        else localStorage.setItem(themeConfig.storageKey, preference)
    } catch {}
}

const prefersDark = () => import.meta.client ? window.matchMedia?.(DARK_QUERY).matches : undefined

const resolve = (preference: ThemePreference) =>
    resolveTheme(preference === 'system' ? null : preference, prefersDark(), {
        names: themeNames,
        fallback: themeConfig.default,
        system: themeConfig.system,
    })

export const useTheme = () => {
    const preference = useState<ThemePreference>('themes:preference', () => 'system')
    const theme = useState<ThemeName>('themes:theme', () => themeConfig.default)

    const apply = (name: ThemeName) => {
        theme.value = name
        if (import.meta.client) document.documentElement.setAttribute(themeConfig.attribute, name)
    }

    const setTheme = (value: ThemePreference): Result<ThemeName, string> => {
        if (!isThemePreference(value)) {
            const message = `Unknown theme "${String(value)}". Available: system, ${themeNames.join(', ')}`
            if (import.meta.dev) console.warn(`[themes] ${message}`)
            return err(message)
        }

        preference.value = value
        if (import.meta.client) writeStored(value)

        const name = resolve(value)
        apply(name)
        return ok(name)
    }

    const listThemes = (): ThemeMeta[] => themeNames.map(name => themes[name])
    const getTheme = (name: ThemeName): ThemeMeta | undefined => isThemeName(name) ? themes[name] : undefined

    return {
        theme: readonly(theme),
        preference: readonly(preference),
        system: themeConfig.system,
        setTheme,
        listThemes,
        getTheme,
        isThemeName,
    }
}

export const syncTheme = () => {
    const preference = useState<ThemePreference>('themes:preference')
    const theme = useState<ThemeName>('themes:theme')

    const stored = readStored()
    preference.value = isThemeName(stored) ? stored : 'system'

    const applied = document.documentElement.getAttribute(themeConfig.attribute)
    theme.value = isThemeName(applied) ? applied : resolve(preference.value)
    document.documentElement.setAttribute(themeConfig.attribute, theme.value)

    const follow = () => {
        if (preference.value !== 'system') return
        theme.value = resolve('system')
        document.documentElement.setAttribute(themeConfig.attribute, theme.value)
    }
    window.matchMedia?.(DARK_QUERY).addEventListener('change', follow)

    window.addEventListener('storage', (event) => {
        if (event.key !== themeConfig.storageKey) return
        preference.value = isThemeName(event.newValue) ? event.newValue : 'system'
        theme.value = resolve(preference.value)
        document.documentElement.setAttribute(themeConfig.attribute, theme.value)
    })

    if (import.meta.dev) console.debug(`[themes] ${theme.value} (preference: ${preference.value})`)
}
