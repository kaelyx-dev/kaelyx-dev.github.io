import { err, ok } from '@kaelyx/ts-kit/result'
import type { Result } from '@kaelyx/ts-kit/types'
import type { ThemeScheme } from './config'

export const readThemeFile = (source: string): Result<{ scheme?: ThemeScheme }, string> => {
    if (!/^\s*\$tokens\s*:/m.test(source)) return err('has no top-level $tokens map')

    const scheme = source.match(/^\s*\$scheme\s*:\s*([^\s;!]+)/m)?.[1]
    if (scheme === undefined) return ok({})
    if (scheme !== 'light' && scheme !== 'dark') return err(`$scheme must be light or dark, got "${scheme}"`)

    return ok({ scheme })
}
