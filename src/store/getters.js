const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  globalUniqueID: state => state.user.globalUniqueID,
  token: state => state.user.token,
  auth: state => state.user.auth,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  permissionRoutes: state => state.permission.routers,
  addRouters: state => state.permission.addRouters
}
export default getters
