import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  // 采用了ES6的对象简洁写法, 只有当key和value相同的时候, {routes}相当于{routes: routes}
  routes,
  // mode默认是哈希模式, 就是URL中会带有#, 哈希模式的好处是URL改变时页面不会刷新, 如果使用history模式的话, URL就是普通的URL, 没有#, 需要配合后端Nginx的配置, 不然刷新页面就会出现404
  // 具体的配置方法参考 https://router.vuejs.org/zh/guide/essentials/history-mode.html
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  next()

})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
