import config from '@config/config_contentParser'

export const calculate = wordCount => {
    let wpm = config.timeToRead.wpm
    return Math.ceil(wordCount / wpm)
}