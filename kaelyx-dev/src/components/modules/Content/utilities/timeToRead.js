import { useConfigStore } from '@/stores/ConfigStore'

export const calculate = wordCount => {
    const config = useConfigStore()
    let wpm = config.getValue("content.timetoread.wpm")
    return Math.ceil(wordCount / wpm)
}