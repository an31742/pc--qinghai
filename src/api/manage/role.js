import request from '@/utils/request'

export default {
// 角色管理-添加角色
  addRole(data) {
    return request({
      url: '/zbms/role',
      method: 'post',
      data
    })
  },
  // 查询角色菜单
  queryMenusByRoleId(data) {
    return request({
      url: '/zbms/role/menu/getRoleMenu',
      method: 'get',
      params: data
    })
  },
  // 角色管理-修改角色
  updateRole(data) {
    return request({
      url: '/zbms/role',
      method: 'put',
      data
    })
  },
  // 角色管理-角色删除
  deleteRole(roleId) {
    return request({
      url: '/zbms/role/' + roleId,
      method: 'delete'
    })
  },
  // 角色管理-列表角色(分页)
  listRole(data) {
    return request({
      url: '/zbms/role/page',
      method: 'get',
      params: data
    })
  },
  // 角色管理-角色配置菜单
  configMenu(data) {
    return request({
      url: 'zbms/role/menu/savaRoleMenu',
      method: 'post',
      data
    })
  }
}
