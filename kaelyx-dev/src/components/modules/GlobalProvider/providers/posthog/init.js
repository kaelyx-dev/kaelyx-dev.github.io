import posthog from "posthog-js"

let initalised = false

export default (enabled, key, options) => {
    if(!enabled) return (() => {})
    if(initalised) return posthog
    else {
        posthog.init(key, options)
        initalised = true
        return posthog
    }
}
