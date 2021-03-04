/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const dutyAssessmentRouter = {
  path: '/dutyAssessment',
  component: Layout,
  // redirect: '/dutyAssessment/assessment/index',
  name: 'DutyAssessment',
  meta: { title: '值班考核', icon: 'star', perm: 'dutyAssessment' },
  children: [
    {
      path: 'assessment/index',
      component: () => import('@/views/dutyAssessment/assessment/index'),
      name: 'DutyAssManage',
      meta: { title: '值班考核列表', perm: 'dutyAssessment:assessment' }
    },
    {
      path: 'assessment/detail',
      hidden: true,
      component: () => import('@/views/dutyAssessment/assessment/detail'),
      name: 'AssDetail',
      meta: { title: '值班考核详情' }
    },
    // {
    //   path: 'attendanceStatistics',
    //   name: 'AttendanceStatistics',
    //   hidden: true,
    //   component: () => import('@/views/dutyAssessment/attendanceStatistics'),
    //   meta: { title: '值班考勤统计' }
    // },
    {
      path: 'dutyStatistics',
      name: 'DutyStatistics',
      component: () => import('@/views/dutyAssessment/dutyStatistics/index'),
      meta: { title: '值班考核统计', perm: 'dutyAssessment:statistics' }
    }
  ]
}

export default dutyAssessmentRouter

