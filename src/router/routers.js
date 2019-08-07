import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * name: 需要是唯一的, 点击左侧的导航的时候是通过route.push({name})来跳转的
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
//用户登录页面
const loginRouter =  {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录',
    hideInMenu: true
  },
  component: () => import('@/view/login/login.vue')
}
//不在菜单栏显示, 只在导航页显示, 并且作为Main组件的子页面展示
const noSideRoutersWithMain = {
    path: '/',
    name: 'noSideRoutersWithMain',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  }

export default [
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'md-settings',
      title: '系统管理'
    },
    // 组件写成main的目的是侧边栏等通用显示部分
    component: Main,
    children: [
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'ios-contact',
          title: '用户管理'
        },
        component: () => import('@/view/system/user.vue')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: 'md-clipboard',
          title: '角色管理'
        },
        component: () => import('@/view/system/role.vue')
      },
      {
        path: 'permission',
        name: 'permission',
        meta: {
          icon: 'md-clipboard',
          title: '权限管理'
        },
        component: () => import('@/view/system/permission.vue')
      }
    ]
  },

  loginRouter,
  noSideRoutersWithMain,

]
