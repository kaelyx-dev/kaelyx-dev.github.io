import type { IconName } from '#icons'
import type { Prettify } from '@kaelyx/ts-kit'

export type * from './style.types'


export type ActionType = 'text' | 'link' | 'primary' | 'secondary' | 'tertiary'

export type NavigationNode = {
    path: string
    name: string
    icon: IconName
    order: number
}

export type HTMLHeaderTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
export type HTMLParagraphTags = 'p' | 'span'
export type HTMLTextTags = Prettify<HTMLHeaderTags | HTMLParagraphTags>


export interface StyleProps extends Partial<TextStyleProps> {}

export interface TextStyleProps {
    font: string
    size: string
    style: string
}

export {}