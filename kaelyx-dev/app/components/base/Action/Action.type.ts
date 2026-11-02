import type { NavigationTarget } from '~~/shared/types/page-meta.types'

interface HrefActionProps {
    action?: never
    href: string
    target?: NavigationTarget
    component?: never
    external?: boolean
}

interface ButtonActionProps {
    href?: never
    action: () => void
}

export type ActionProps = HrefActionProps | ButtonActionProps