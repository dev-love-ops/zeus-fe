import Main from '@/components/main'


export default {
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
      path: 'message',
      name: 'message',
      meta: {
        icon: 'md-notifications',
        title: '消息中心'
      },
      component: () => import('@/view/single-page/message/index.vue')
    }
  ]
}
