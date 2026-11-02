import 'nuxt/app'
import 'vue-router'
import type { ActionType } from './global.types'
import type { IconName } from '#icons'

export type NavigationTarget = '_blank' | '_self' | '_parent' | '_top'

export interface NavigationMeta {
    order?: number
    label?: string
    type?: ActionType
    icon?: IconName
    visible: {
        header?: boolean
        footer?: boolean
    }    
}

export interface NavigationNode extends Omit<NavigationMeta, 'visible'> {
    name: string
    path: string
    target?: NavigationTarget
    external?: boolean
}

declare module 'nuxt/app' {
    interface PageMeta {
        NavigationMeta: NavigationMeta
    }
}

declare module 'vue-router' {
    interface RouteMeta {
        NavigationMeta: NavigationMeta
    }
}

export {}