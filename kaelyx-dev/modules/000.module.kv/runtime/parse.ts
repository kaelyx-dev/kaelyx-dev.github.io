export const parseConf = (conf: string) => {
    const out: Record<string, string> = {}

    for(const raw of conf.split(/\r?\n/)) {
        const line = raw.trim()

        // skip empty lines and lines starting with comment characters
        const noLine = !line
        const startsWithHash = line.startsWith('#')
        const startsWithSemi = line.startsWith(';')
        if(noLine || startsWithHash || startsWithSemi) continue

        // check if = exists in the line, if not skip this line
        const indexOfEquals = line.indexOf('=')
        const lineHasEquals = indexOfEquals !== -1
        if(!lineHasEquals) continue

        // strip potential comments at end of valid line too
        const rawValue = line.slice(indexOfEquals + 1).trim()
        const valueWithoutComment = (rawValue.split(/[#;]/)[0] ?? '').trim()

        // extract the key and value, ensuring both are non-empty before adding to output
        const [key, value] = [line.slice(0, indexOfEquals).trim(), valueWithoutComment]
        if(key && value) out[key] = value
    }

    return out
}