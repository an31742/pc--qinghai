import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: true }) // NProgress Configuration

const whiteList = ['/401', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  if (to.query.globalUniqueID && !hasToken) {
    await store.dispatch('user/login', to.query.globalUniqueID)
  }
  const hasToken = getToken()
  if (hasToken) {
    const hasGetUserInfo = store.getters.name
    if (hasGetUserInfo) { // 判断当前用户是不是登陆成功
      next()
    } else {
      await store.dispatch('user/getInfo').then(res => {
        const perms = res.permissions || []
        // const perms = ['system', 'system:user', 'system:role']
        store.dispatch('permission/GenerateRoutes', { perms }).then(() => {
          router.addRoutes(store.getters.addRouters)
          next({ ...to, replace: true })
        })
      }).catch((error) => {
        store.dispatch('user/resetToken').then(() => {
          const ErrMsg = error || 'Has Error'
          Message.error(ErrMsg)
          next({ path: '/401' })
          NProgress.done()
        })
      })
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 跳转的路由没有在白名单中
      next()
    } else {
      next(`/401`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
