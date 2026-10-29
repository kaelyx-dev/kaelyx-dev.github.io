export interface ResolveOptions<T extends string> {
    names: readonly T[]
    fallback: T
    system: { follow: boolean, light: T, dark: T }
}

export const resolveTheme = <T extends string>(stored: unknown, prefersDark: boolean | undefined, opts: ResolveOptions<T>): T => {
    if (typeof stored === 'string' && (opts.names as readonly string[]).includes(stored)) return stored as T
    if (!opts.system.follow || prefersDark === undefined) return opts.fallback
    return prefersDark ? opts.system.dark : opts.system.light
}
