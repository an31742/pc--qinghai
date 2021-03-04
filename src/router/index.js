import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import workforceManagementRouter from './modules/workforceManagement'
import dutyInquiryRouter from './modules/dutyInquiry'
import dutyAssessmentRouter from './modules/dutyAssessment'
import basicConfigRouter from './modules/basicConfig'
import systemManageRouter from './modules/systemManage'
import workbenchRouter from './modules/workbench'

export const constantRouterMap = [
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '/401', component: () => import('@/views/401'), hidden: true },

  {
    path: '',
    component: Layout,
    redirect: '/workbench/index'
    // children: [
    //   {
    //     path: 'dashboard',
    //     component: () => import('@/views/dashboard/index'),
    //     name: 'Dashboard',
    //     meta: { title: '值班管理系统', icon: 'dashboard', affix: true }
    //   }
    // ]
  }

]
export const asyncRouterMap = [

  workbenchRouter,
  workforceManagementRouter,
  dutyInquiryRouter,
  dutyAssessmentRouter,
  basicConfigRouter,
  systemManageRouter,
  { path: '*', redirect: '/404', hidden: true }
  // 404 page must be placed at the end !!!

]

// const createRouter = () => new Router({
//   // mode: 'history', // require service support
//   scrollBehavior: () => ({ y: 0 }),
//   routes: constantRouterMap
// })

// const router = createRouter()

// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

// export default router
export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
