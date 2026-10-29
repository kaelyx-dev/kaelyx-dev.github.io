import type { IconName } from '#icons'

export type ActionType = 'text' | 'link' | 'primary' | 'secondary' | 'tertiary'

export type NavigationNode = {
    path: string
    name: string
    icon: IconName
    order: number
}

export {}