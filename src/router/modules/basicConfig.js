/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const basicConfigRouter = {
  path: '/basicConfig',
  component: Layout,
  redirect: '/basicConfig/dutyManage/index',
  name: 'BasicConfig',
  meta: { title: '基础配置', icon: 'link', perm: 'basicConfig' },
  children: [
    {
      path: 'dutyManage/index',
      component: () => import('@/views/basicConfig/dutyManage/index'),
      name: 'DutyLManage',
      meta: { title: '值班配置列表', perm: 'basicConfig:duty' }
    },
    {
      path: 'dutyManage/dutyConfig',
      hidden: true,
      component: () => import('@/views/basicConfig/dutyManage/config'),
      name: 'DutyConfig',
      meta: { title: '值班配置' }
    },
    {
      path: 'roomManage/index',
      component: () => import('@/views/basicConfig/roomManage/index'),
      name: 'RoomManage',
      meta: { title: '机房列表', perm: 'basicConfig:room' }
    },
    {
      path: 'roomManage/roomAdd',
      hidden: true,
      component: () => import('@/views/basicConfig/roomManage/add'),
      name: 'RoomAdd',
      meta: { title: '新增机房' }
    },
    {
      path: 'roomManage/roomConfig',
      hidden: true,
      component: () => import('@/views/basicConfig/roomManage/config'),
      name: 'RoomConfig',
      meta: { title: '班组配置' }
    }
  ]
}

export default basicConfigRouter
// 中间插一行, 表单复制, id不好写

