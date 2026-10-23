import { useState } from '#imports'
import defaults from '#build/kv-defaults.mjs'

// ';' can't be used here as parseConf treats it as the start of an inline comment
export const LIST_DELIMITER = ','

const toList = (value: unknown): string[] => {
    if(Array.isArray(value)) return value.map(String)
    if(value === undefined || value === null) return []

    return String(value)
        .split(LIST_DELIMITER)
        .map(item => item.trim())
        .filter(Boolean)
}

export const useKv = () => {
    // useState keeps runtime assignments shared across components and carried from SSR to the client
    const kv = useState<Record<string, unknown>>('kv', () => ({ ...defaults }))

    const has = (key: string) => key in kv.value

    const get = <T = string>(key: string, fallback?: T): T | undefined =>
        has(key) ? kv.value[key] as T : fallback

    const assign = (key: string, value: unknown) => {
        kv.value[key] = value
    }

    const getList = (key: string, fallback: string[] = []) =>
        has(key) ? toList(kv.value[key]) : fallback

    // stored joined so it reads back the same way as a value from a .conf file
    const assignList = (key: string, items: unknown[]) => {
        kv.value[key] = items.map(String).join(LIST_DELIMITER)
    }

    const appendList = (key: string, ...items: unknown[]) => {
        assignList(key, [...getList(key), ...items])
    }

    const removeFromList = (key: string, ...items: unknown[]) => {
        const remove = new Set(items.map(String))
        assignList(key, getList(key).filter(item => !remove.has(item)))
    }

    return { kv, has, get, assign, getList, assignList, appendList, removeFromList }
}
