/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const workforceManagementRouter = {
  path: '/workforceManagement',
  component: Layout,
  redirect: '/workforceManagement/scheduling/list',
  name: 'WorkforceManagement',
  meta: { title: '排班管理', icon: 'user', perm: 'workforce' },
  children: [
    {
      path: 'scheduling/list',
      name: 'Scheduling',
      component: () => import('@/views/workforceManagement/scheduling/index'),
      // redirect: '/workforceManagement/scheduling/list',
      meta: { title: '排班配置列表', perm: 'workforce:list' }
    },
    {
      path: 'scheduling/config',
      name: 'Config',
      hidden: true,
      component: () => import('@/views/workforceManagement/scheduling/config'),
      meta: { title: '排班配置' }
    },
    {
      path: 'table/table-see',
      name: 'Table',
      component: () => import('@/views/workforceManagement/table/index'),
      meta: { title: '安排排班表', perm: 'workforce:table' }
    },
    {
      path: 'table/table-edit',
      name: 'TableEdit',
      hidden: true,
      component: () => import('@/views/workforceManagement/table/tableEdit'),
      meta: { title: '安排排班表-编辑' }
    }

  ]
}

export default workforceManagementRouter

