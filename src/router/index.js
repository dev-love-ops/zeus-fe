import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import noSideRoutersWithMain from './noSideRoutersWithMain'
import sideRouters from './sideRouters'
import store from '@/store'
import iView from 'iview'
import { canTurnTo, setTitle } from '@/libs/util'
import { getStorage, setStorage } from '@/libs/storage'
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
//动态添加路由
router.addRoutes([sideRouters])
//经过上面的动作以后只是添加了路由, 但是左侧的菜单还是不显示, 这里把左侧的菜单存储到了vuex中, 因为vuex是响应式的


store.dispatch('setMenuListAsync')


router.beforeEach((to, from, next) => {
  //每次进入新的路由加载头上的进度条
  iView.LoadingBar.start()
  //放行登录页面
  if (to.path === 'login'){
    next()
    return
  }
  //判断用户是否登录, 未登录的跳转到登录页面
  const token = getStorage('token')
  if (!token && to.name !== 'login'){
    next({ name: 'login' });
  }

  next()

})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
