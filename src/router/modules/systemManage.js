/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const systemManageRouter = {
  path: '/system',
  component: Layout,
  redirect: '/system/user',
  name: 'systemManage',
  meta: { title: '系统管理', icon: 'list', perm: 'system' },
  children: [
    {
      path: 'user',
      component: () => import('@/views/system/user'),
      name: 'UserManage',
      meta: { title: '人员管理', perm: 'system:user' }
    },
    {
      path: 'role',
      name: 'RoleManage',
      component: () => import('@/views/system/role'),
      meta: { title: '角色管理', perm: 'system:role' }
    }
    // {
    //   path: 'menu',
    //   name: 'MenuManage',
    //   component: () => import('@/views/system/menu'),
    //   meta: { title: '菜单管理', perm: 'm:sys:menu' }
    // }
  ]
}

export default systemManageRouter

