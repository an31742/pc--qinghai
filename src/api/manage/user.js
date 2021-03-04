import request from '@/utils/request'
export default {
  // 用户管理-添加人员用户
  addUser(data) {
    return request({
      url: '/zbms/user/saveBath',
      method: 'post',
      data
    })
  },
  // 用户管理-配置角色
  configRole(userId, roleIds) {
    return request({
      url: '/zbms/user/role',
      method: 'get',
      params: {
        userId,
        roleIds
      }
    })
  },
  // 用户管理-冻结解锁用户
  disableUser(id, state) {
    return request({
      url: '/zbms/user/oper/' + id + '/' + state,
      method: 'put'
    })
  },
  // 用户管理-删除用户
  delUser(username) {
    return request({
      url: '/zbms/user/delUser',
      method: 'get',
      params: {
        username
      }
    })
  },
  // 用户管理-用户列表
  userList(data) {
    return request({
      url: '/zbms/user/page',
      method: 'get',
      params: data
    })
  },
  // 用户管理-Id查询用户
  getUserRoles(id) {
    return request({
      url: '/zbms/user/' + id,
      method: 'get'
    })
  },
  roleList(data) {
    return request({
      url: '/zbms/role/list',
      method: 'get',
      params: data
    })
  }
}
