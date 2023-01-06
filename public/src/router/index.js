import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from '@/router/routes'
import beforeEachGuards from './guards/before-each'
import afterEachGuards from './guards/after-each'

if (!process || process.env.NODE_ENV !== 'test') {
  Vue.use(VueRouter)
}

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  Object.values(beforeEachGuards).forEach((middleware) => {
    middleware(to, from, next)
  })
})

router.afterEach((to, from) => {
  Object.values(afterEachGuards).forEach((middleware) => {
    middleware(to, from)
  })
})

export default router
