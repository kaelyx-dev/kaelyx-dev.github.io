import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { icons, type IconName } from '#icons'

const warned = new Set<string>()

// narrows a string from content, kv or an API so it can be passed to useIcon / <Icon>
export const isIconName = (value: unknown): value is IconName =>
    typeof value === 'string' && Object.hasOwn(icons, value)

export const useIcon = (name: MaybeRefOrGetter<IconName>) => {
    const meta = computed(() => {
        const value = toValue(name)
        if (isIconName(value)) return icons[value]

        // only reachable by forcing a string past the IconName type, so warn once per name
        if (import.meta.dev && !warned.has(value)) {
            warned.add(value)
            console.warn(`[icons] Unknown icon "${value}"`)
        }
        return undefined
    })

    const exists = computed(() => meta.value !== undefined)
    const id = computed(() => meta.value?.id)
    const href = computed(() => meta.value && `#${meta.value.id}`)
    const viewBox = computed(() => meta.value?.viewBox)

    return { exists, id, href, viewBox }
}
