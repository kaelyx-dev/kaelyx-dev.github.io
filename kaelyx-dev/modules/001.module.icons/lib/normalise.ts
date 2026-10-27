import { convertCase } from '@kaelyx/ts-kit/string'
import { err, ok } from '@kaelyx/ts-kit/result'
import type { Result } from '@kaelyx/ts-kit/types'

export interface NormaliseOptions {
    splitCamelCase: boolean
    acronyms: string[]
}

// 'social/GitHub_Logo.svg' -> 'social-git-hub-logo', or 'social-github-logo' without splitCamelCase
export const toIconName = (relPath: string, opts: NormaliseOptions): Result<string, string> => {
    const base = relPath.replace(/\.svg$/i, '')

    // lowercasing first leaves convertCase no capitals to split words on
    const input = opts.splitCamelCase ? base : base.toLowerCase()
    const name = convertCase(input, { to: 'kebab', acronyms: opts.acronyms })

    return name ? ok(name) : err(`"${relPath}" has no letters or digits to name it by`)
}
