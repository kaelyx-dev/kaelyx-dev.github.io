export interface HeadScriptOptions {
    names: string[]
    attribute: string
    storageKey: string
    fallback: string
    system: { follow: boolean, light: string, dark: string }
}

export const toHeadScript = (opts: HeadScriptOptions) => {
    const c = JSON.stringify({
        names: opts.names,
        attr: opts.attribute,
        key: opts.storageKey,
        fallback: opts.fallback,
        follow: opts.system.follow,
        light: opts.system.light,
        dark: opts.system.dark,
    })

    return `(function(){var c=${c},t=null;try{t=localStorage.getItem(c.key)}catch(e){}`
        + `if(c.names.indexOf(t)<0){t=c.fallback;`
        + `try{if(c.follow)t=matchMedia('(prefers-color-scheme: dark)').matches?c.dark:c.light}catch(e){}}`
        + `document.documentElement.setAttribute(c.attr,t)})()`
}

export const toColorSchemeMeta = (schemes: string[]) =>
    [...new Set(schemes)].sort((a, b) => a === 'light' ? -1 : b === 'light' ? 1 : 0).join(' ')
