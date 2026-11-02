import type { NavigationTarget } from '~~/shared/types/page-meta.types'

export type ActionType = 'text' | 'link' | 'primary' | 'secondary' | 'tertiary'

interface BaseActionProps {
    type?: ActionType
}

interface HrefActionProps extends BaseActionProps {
    action?: never
    href: string
    target?: NavigationTarget
    component?: never
    external?: boolean
}

interface ButtonActionProps extends BaseActionProps {
    href?: never
    action: () => void
}

export type ActionProps = HrefActionProps | ButtonActionProps