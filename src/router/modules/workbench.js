/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const workbenchRouter = {
  path: '/workbench',
  component: Layout,
  redirect: '/workbench/index',
  name: 'workbench',
  meta: { title: '工作台', icon: 'clipboard', perm: 'workbench' },
  children: [
    {
      path: 'index',
      hidden: true,
      component: () => import('@/views/workbench/workbench'),
      name: 'Index'
    },
    {
      path: 'changeShifts',
      name: 'ChangeShifts',
      hidden: true,
      meta: { title: '交接班' },
      component: () => import('@/views/workbench/changeShifts'),
      redirect: '/workbench/changeShifts/jiaoban',
      children: [
        {
          path: 'jiaoban',
          component: () => import('@/views/workbench/changeShifts/jiaoban'),
          meta: { title: '交班' }
        }
      ]
    },
    {
      path: 'faultRecord',
      name: 'FaultRecord',
      hidden: true,
      component: () => import('@/views/workbench/faultRecord'),
      meta: { title: '故障记录填报' },
      redirect: '/workbench/faultRecord/log',
      children: [
        {
          path: 'log',
          component: () => import('@/views/workbench/faultRecord/log'),
          name: 'Log',
          meta: { title: '故障记录日志填报' }
        },
        {
          path: 'add',
          component: () => import('@/views/workbench/faultRecord/add'),
          name: 'Add',
          meta: { title: '记录新增' }
        }
      ]
    },
    {
      path: 'visitRecord',
      name: 'VisitRecord',
      hidden: true,
      component: () => import('@/views/workbench/visitRecord'),
      meta: { title: '值班巡检记录填报' }
    }
  ]
}

export default workbenchRouter

