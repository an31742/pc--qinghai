/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const dutyInquiryRouter = {
  path: '/dutyInquiry',
  component: Layout,
  redirect: '/dutyInquiry/log/logList',
  name: 'DutyInquiry',
  meta: { title: '值班查询', icon: 'zip', perm: 'dutyInquiry' },
  children: [
    {
      path: 'log/logList',
      component: () => import('@/views/dutyInquiry/logQuery/index'),
      name: 'Log',
      meta: { title: '值班日志列表', perm: 'dutyInquiry:log' }
    },
    {
      path: 'log/jiaoJieDetail',
      hidden: true,
      component: () => import('@/views/dutyInquiry/logQuery/jiaoJieDetail'),
      name: 'JiaoJieDetail',
      meta: { title: '交接班记录详情' }
    },
    {
      path: 'log/xunJianDetail',
      hidden: true,
      component: () => import('@/views/dutyInquiry/logQuery/xunJianDetail'),
      name: 'XunJianDetail',
      meta: { title: '值班巡检记录系详情' }
    },
    {
      path: 'log/zhiBanDetail',
      hidden: true,
      component: () => import('@/views/dutyInquiry/logQuery/zhiBanDetail'),
      name: 'ZhiBanDetail',
      meta: { title: '值班日志记录详情' }
    },
    {
      path: 'log/zongHeDetail',
      hidden: true,
      component: () => import('@/views/dutyInquiry/logQuery/zongHeDetail'),
      name: 'ZongHeDetail',
      meta: { title: '综合查询记录详情' }
    },
    {
      path: 'record/recordList',
      component: () => import('@/views/dutyInquiry/recordQuery/index'),
      name: 'Record',
      meta: { title: '故障记录列表', perm: 'dutyInquiry:record' }
    },
    {
      path: 'record/recordDdetail',
      hidden: true,
      component: () => import('@/views/dutyInquiry/recordQuery/detail'),
      name: 'Detail',
      meta: { title: '故障记录明细' }
    }
  ]
}

export default dutyInquiryRouter

