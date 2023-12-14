import { createRouter, createWebHistory } from 'vue-router'
import portal from '@/view/portal.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Portal',
            component: portal,
            redirect: '/singlemarkermap',
            children: [
                {
                    path: '/singlemarkermap',
                    name: 'SingleMarkerMap',
                    component: () => import('@/view/singleMarekerMap.vue')
                },
                {
                    path: '/routemap',
                    name: 'RouteMap',
                    component: () => import('@/view/routeMap.vue')
                },
                {
                    path: '/dragroutemap',
                    name: 'DragRouteMap',
                    component: () => import('@/view/dragRouteMap.vue')
                },
                {
                    path: '/olsmpmap',
                    name: 'OlSmpMap',
                    component: () => import('@/view/olSmpMap.vue')
                },
                {
                    path: '/olofflinemap',
                    name: 'OlOfflineMap',
                    component: () => import('@/view/olOfflineMap.vue')
                }
            ]
        }
    ]
})
export default router