import { template } from '@kaelyx/ts-kit/string'
import { omit } from '@kaelyx/ts-kit/object'
import { err, ok } from '@kaelyx/ts-kit/result'
import type { Result } from '@kaelyx/ts-kit/types'

export interface SymbolOptions {
    currentColor: boolean
}

export interface IconSymbol {
    markup: string
    viewBox: string
}

const SYMBOL = '<symbol id="{{id}}" viewBox="{{viewBox}}"><g{{attrs}}>{{body}}</g></symbol>'

// position/size it out of the way rather than display:none, which breaks gradients and masks inside <use>
const SPRITE = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">{{symbols}}</svg>'

const ROOT_RE = /<svg\b([^>]*)>([\s\S]*)<\/svg>/i
const ATTR_RE = /([\w:.-]+)\s*=\s*(["'])([\s\S]*?)\2/g
// lookbehind rather than \b so data-id and similar are left alone
const ID_RE = /(?<![\w:-])id\s*=\s*(["'])(.*?)\1/g
const COLOUR_RE = /\b(fill|stroke)\s*=\s*(["'])(?!none\2|currentColor\2|url\()[^"']*\2/gi

// root attributes the symbol or <Icon> provides itself; anything else (fill, stroke-width...) moves onto a <g>
const DROPPED_ATTRS = ['viewBox', 'width', 'height', 'x', 'y', 'id', 'class', 'version', 'role', 'focusable', 'baseProfile', 'xml:space', 'enable-background']
const DROPPED_PREFIX_RE = /^(xmlns|aria-|data-)/

const strip = (svg: string) => svg
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(title|desc|metadata)\b[\s\S]*?<\/\1>/gi, '')

const parseAttrs = (raw: string) =>
    Object.fromEntries([...raw.matchAll(ATTR_RE)].map(([, key, , value]) => [key!, value!]))

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const toViewBox = (attrs: Record<string, string>) => {
    if (attrs.viewBox) return attrs.viewBox.trim()

    const [width, height] = [parseFloat(attrs.width ?? ''), parseFloat(attrs.height ?? '')]
    return width > 0 && height > 0 ? `0 0 ${width} ${height}` : undefined
}

// every icon shares one document, so ids like a gradient's "a" have to be made unique per icon
const prefixIds = (body: string, prefix: string) => {
    const ids = new Set([...body.matchAll(ID_RE)].map(([, , id]) => id!))

    for (const id of ids) {
        const escaped = escapeRegExp(id)
        body = body
            .replace(new RegExp(`((?<![\\w:-])id\\s*=\\s*["'])${escaped}(["'])`, 'g'), `$1${prefix}${id}$2`)
            .replace(new RegExp(`url\\(\\s*(["']?)#${escaped}\\1\\s*\\)`, 'g'), `url(#${prefix}${id})`)
            .replace(new RegExp(`(href\\s*=\\s*["'])#${escaped}(["'])`, 'g'), `$1#${prefix}${id}$2`)
    }

    return body
}

export const svgToSymbol = (id: string, source: string, opts: SymbolOptions): Result<IconSymbol, string> => {
    const match = strip(source).match(ROOT_RE)
    if (!match) return err('no <svg> root element')

    const rootAttrs = parseAttrs(match[1] ?? '')
    const viewBox = toViewBox(rootAttrs)
    if (!viewBox) return err('no viewBox, and no width and height to make one from')

    const kept = Object.entries(omit(rootAttrs, DROPPED_ATTRS)).filter(([key]) => !DROPPED_PREFIX_RE.test(key))
    let attrs = kept.map(([key, value]) => ` ${key}="${value}"`).join('')
    let body = prefixIds((match[2] ?? '').trim(), `${id}--`)

    if (opts.currentColor) {
        attrs = attrs.replace(COLOUR_RE, '$1="currentColor"')
        body = body.replace(COLOUR_RE, '$1="currentColor"')
    }

    // THROW so a typo in SYMBOL fails at startup instead of producing a broken sprite
    const markup = template(SYMBOL, { id, viewBox, attrs, body }, { unknownBehaviour: 'THROW' })
    return ok({ markup, viewBox })
}

export const toSprite = (symbols: string[]) =>
    template(SPRITE, { symbols: symbols.join('') }, { unknownBehaviour: 'THROW' })
