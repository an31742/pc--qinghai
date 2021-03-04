import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.perm判断是否与当前用户权限匹配
 * @param perms 登录用户的权限
 * @param route 路由对象
 */
function hasPermission(perms, route) {
  // 如果没有声明meta或者meta.perm，都视为可以公共访问的路由
  if (!route.meta || !route.meta.perm) {
    return true
  }
  return perms.some(p => {
    return p === route.meta.perm
  })
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, perms) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(perms, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, perms)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const state = {
  routers: constantRouterMap,
  addRouters: []
}
const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRouterMap.concat(routers)
  }
}
const actions = {
  GenerateRoutes({ commit }, data) {
    return new Promise(resolve => {
      let accessedRouters
      const perms = data.perms
      // [{name:'所有权限',perm:'*'}]
      if (perms.some(p => p === '*')) {
        accessedRouters = asyncRouterMap
      } else {
        accessedRouters = filterAsyncRouter(asyncRouterMap, perms)
      }
      commit('SET_ROUTERS', accessedRouters)
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
