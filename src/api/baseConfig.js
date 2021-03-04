import request from '@/utils/request'
export default {
  // 值班配置列表
  getZbList(data) {
    return request({
      url: '/zbms/zbConf/list',
      method: 'get',
      params: data
    })
  },
  // 值班配置保存
  configRole(data) {
    return request({
      url: '/zbms/zbConf/save',
      method: 'post',
      data
    })
  },
  // 值班配置删除
  configRoleRemove(data) {
    return request({
      url: '/zbms/zbConf/remove',
      method: 'get',
      params: data
    })
  },
  // 班次查询(暂时不知道啥用)
  disableUser(data) {
    return request({
      url: '/zbms/zbSched/list',
      method: 'get',
      params: data
    })
  },
  // 班组列表
  getGroupList(data) {
    return request({
      url: '/zbms/zbGroup/gruopList',
      method: 'get',
      params: data
    })
  },
  // 可选值班人员
  getZbUser(data) {
    return request({
      url: '/zbms/zbGroup/userList',
      method: 'get',
      params: data
    })
  },
  // 班组删除
  delGroup(data) {
    return request({
      url: '/zbms/zbGroup/delGroup',
      method: 'get',
      params: data
    })
  },
  // 班组保存
  saveGroup(data) {
    return request({
      url: '/zbms/zbGroup/saveGroup',
      method: 'post',
      data
    })
  },
  // 机房
  // 新增机房
  saveRoom(data) {
    return request({
      url: '/zbms/zbRoom/saveRoom',
      method: 'post',
      data
    })
  },
  // 删除机房
  delRoom(data) {
    return request({
      url: '/zbms/zbRoom/delRoom',
      method: 'get',
      params: data
    })
  },
  // 机房列表
  getRoomList(data) {
    return request({
      url: '/zbms/zbRoom/roomList',
      method: 'get',
      params: data
    })
  },
  // 机房人员列表
  getUserList(data) {
    return request({
      url: '/zbms/zbRoom/userList',
      method: 'get',
      params: data
    })
  },
  // 机房-编辑
  selRoom(id) {
    return request({
      url: '/zbms/zbRoom/selRoom',
      method: 'get',
      params: {
        id
      }
    })
  }
}
