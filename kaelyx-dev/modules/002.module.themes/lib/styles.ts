export interface StylesSelectorOptions {
    attribute: string
    fallback: string
}

// The selector a theme's `styles` mixin is wrapped in. The default theme can't use plain :root the way
// `define` does: tokens are overridden by later themes, but a style rule under :root always matches and
// would leak into every other theme. :not([attr]) covers visitors without JavaScript at the same specificity
export const toStylesSelector = (name: string, opts: StylesSelectorOptions) => {
    const own = `:root[${opts.attribute}="${name}"]`
    return name === opts.fallback ? `:root:not([${opts.attribute}]), ${own}` : own
}

export const toStylesRule = (name: string, namespace: string, opts: StylesSelectorOptions) =>
    `${toStylesSelector(name, opts)} { @include ${namespace}.styles; }`
