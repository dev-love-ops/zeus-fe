import Main from '@/components/main'


export default {
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
}
