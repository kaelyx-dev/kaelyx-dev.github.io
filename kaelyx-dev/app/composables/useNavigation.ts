import type { RouteRecordNormalized } from "vue-router"
import type { NavigationMeta, NavigationNode } from '~~/shared/types/page-meta.types'
import { omit } from '@kaelyx/ts-kit/object/omit'
export const useNavigation = () => {

    const routes = useRouter().getRoutes()

    const _isVisible = (route: RouteRecordNormalized, location: keyof NavigationMeta['visible']): boolean => route.meta?.NavigationMeta?.visible[location] ?? false
    const _mapToNavigationNode = (route: RouteRecordNormalized): NavigationNode => ({
        ...omit(route.meta?.NavigationMeta, ['visible']),
        name: route.meta?.NavigationMeta?.label ?? route.name as string,
        path: route.path
    })
    const _sortByOrder = (a: NavigationNode, b: NavigationNode): number => (a.order ?? 0) - (b.order ?? 0)

    const _process = (routes: RouteRecordNormalized[], location: keyof NavigationMeta['visible']): NavigationNode[] => {
        return routes.filter(route => _isVisible(route, location))
                     .map(_mapToNavigationNode)
                     .sort(_sortByOrder)
    }

    return {
        getHeaderRoutes: (): NavigationNode[] => _process(routes, 'header'),
        getFooterRoutes: (): NavigationNode[] => _process(routes, 'footer')
    }
}

export default useNavigation