import { describe, expect, it } from 'vitest'
import { toStylesRule, toStylesSelector } from './styles'

const opts = { attribute: 'data-theme', fallback: 'light' }

describe('toStylesSelector', () => {
    it('scopes a non-default theme to its attribute', () => {
        expect(toStylesSelector('dark', opts)).toBe(':root[data-theme="dark"]')
    })

    it('never uses plain :root for the default theme, so its styles cannot leak into other themes', () => {
        const selector = toStylesSelector('light', opts)
        expect(selector).toBe(':root:not([data-theme]), :root[data-theme="light"]')
        expect(selector.split(',').map(part => part.trim())).not.toContain(':root')
    })
})

describe('toStylesRule', () => {
    it('includes the theme module\'s styles mixin under its selector', () => {
        expect(toStylesRule('dark', 't1', opts)).toBe(':root[data-theme="dark"] { @include t1.styles; }')
    })
})
