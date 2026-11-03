import { err, ok } from '@kaelyx/ts-kit/result'
import type { Result } from '@kaelyx/ts-kit/types'
import type { ThemeScheme } from './config'

export interface ThemeFileMeta {
    scheme?: ThemeScheme
    styles: boolean
}

export const readThemeFile = (source: string): Result<ThemeFileMeta, string> => {
    if (!/^\s*\$tokens\s*:/m.test(source)) return err('has no top-level $tokens map')

    // An optional `@mixin styles` holds rules that apply only while this theme is active
    const styles = /^\s*@mixin\s+styles\s*[({]/m.test(source)

    const scheme = source.match(/^\s*\$scheme\s*:\s*([^\s;!]+)/m)?.[1]
    if (scheme === undefined) return ok({ styles })
    if (scheme !== 'light' && scheme !== 'dark') return err(`$scheme must be light or dark, got "${scheme}"`)

    return ok({ scheme, styles })
}
