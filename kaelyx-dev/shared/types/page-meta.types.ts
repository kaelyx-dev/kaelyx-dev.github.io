import 'nuxt/app'
import 'vue-router'
import type { ActionType } from './global.types'

export interface NavigationMeta {
    order?: number
    label?: string
    type?: ActionType
    visible: {
        header?: boolean
        footer?: boolean
    }    
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