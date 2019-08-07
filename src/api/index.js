const api = {
  system: {
    user: {
      user: '/api/system/user',
      menuList: '/api/system/user/menuList'
    },
    role: {
      role: '/api/system/role',
      permission: '/api/system/role/permission',
    },
    permission: {
      all: '/api/system/permission/all',
      permission: '/api/system/permission'
    }
  },
  login: '/api/login',
  logout: '/api/logout',
}

export default api
