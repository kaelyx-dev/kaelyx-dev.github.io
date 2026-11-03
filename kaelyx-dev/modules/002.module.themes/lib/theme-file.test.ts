import { describe, expect, it } from 'vitest'
import { readThemeFile } from './theme-file'

const TOKENS = '$tokens: (\n  colour: (background: #fff, foreground: #000),\n);\n'

describe('readThemeFile', () => {
    it('needs a top-level $tokens map', () => {
        expect(readThemeFile('$colours: ();').ok).toBe(false)
    })

    it('has no styles by default', () => {
        expect(readThemeFile(TOKENS)).toEqual({ ok: true, value: { styles: false } })
    })

    it('finds a styles mixin', () => {
        const source = `@use '@themes/api' as theme;\n\n${TOKENS}\n@mixin styles {\n  .background { min-height: 8rem; }\n}\n`
        expect(readThemeFile(source)).toEqual({ ok: true, value: { styles: true } })
    })

    it('ignores other mixins and a styles mixin that is commented out', () => {
        expect(readThemeFile(`${TOKENS}@mixin stylesheet {}\n`)).toMatchObject({ value: { styles: false } })
        expect(readThemeFile(`${TOKENS}@mixin styles-extra {}\n`)).toMatchObject({ value: { styles: false } })
        expect(readThemeFile(`${TOKENS}// @mixin styles {}\n`)).toMatchObject({ value: { styles: false } })
    })

    it('reads $scheme alongside styles', () => {
        expect(readThemeFile(`${TOKENS}$scheme: dark;\n@mixin styles {}\n`)).toEqual({ ok: true, value: { scheme: 'dark', styles: true } })
    })

    it('rejects an unknown $scheme', () => {
        expect(readThemeFile(`${TOKENS}$scheme: dim;\n`).ok).toBe(false)
    })
})
