import type { RouteRecordNormalized } from "vue-router"
import type { NavigationMeta, NavigationNode, NavigationTarget } from '~~/shared/types/page-meta.types'
import { omit } from '@kaelyx/ts-kit/object/omit'
export const useNavigation = () => {

    const MAX_ORDER = Number.POSITIVE_INFINITY

    const routes = useRouter().getRoutes()

    const getConfigNavigationEntries = () :NavigationNode[] => {
        const entries = useKv().getFromPath('navigation.entry')
        return Object.entries(entries ?? {}).map(([key, value]) => {
            return {
                name: value.name ?? key,
                path: value.path ?? '',
                order: value.order ?? MAX_ORDER,
                header: value.header ?? false,
                footer: value.footer ?? false,
                target: value.target ?? '_self',
                external: value.external ?? false
            }
        })

    }

    const _isVisible = (route: RouteRecordNormalized, location: keyof NavigationMeta['visible']): boolean => route.meta?.NavigationMeta?.visible[location] ?? false
    const _mapToNavigationNode = (route: RouteRecordNormalized): NavigationNode => ({
        ...omit(route.meta?.NavigationMeta, ['visible']),
        name: route.meta?.NavigationMeta?.label ?? route.name as string,
        path: route.path
    })
    const _sortByOrder = (a: NavigationNode, b: NavigationNode): number => (a.order ?? MAX_ORDER) - (b.order ?? MAX_ORDER)

    const _process = (routes: RouteRecordNormalized[], location: keyof NavigationMeta['visible']): NavigationNode[] => {
        return routes.filter(route => _isVisible(route, location))
                     .map(_mapToNavigationNode)
                     .concat(getConfigNavigationEntries())
                     .sort(_sortByOrder)
    }

    return {
        getHeaderRoutes: (): NavigationNode[] => _process(routes, 'header'),
        getFooterRoutes: (): NavigationNode[] => _process(routes, 'footer'),
        getConfigNavigationEntries
    }
}

export default useNavigation