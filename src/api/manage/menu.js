import request from '@/utils/request'

export default {
  // 树菜单-废弃
  // treeMenu(data) {
  //   return request({
  //     url: '/zbms/menu/tree',
  //     method: 'get',
  //     params: data
  //   })
  // },
  // 新增菜单
  addMenu(data) {
    return request({
      url: '/zbms/menu',
      method: 'post',
      data
    })
  },
  // 编辑菜单
  editMenu(data) {
    return request({
      url: '/zbms/menu',
      method: 'put',
      data
    })
  },
  // 删除菜单
  delMenu(id) {
    return request({
      url: '/zbms/menu/' + id,
      method: 'delete'
    })
  },
  // 查询菜单
  queryMenu(id) {
    return request({
      url: '/zbms/menu/' + id,
      method: 'get'
    })
  },
  // 角色的菜单集合
  getMenuListByRoleId(id) {
    return request({
      url: '/zbms/menu/tree/' + id,
      method: 'get'
    })
  },
  // 菜单分类获取
  getMenuClassList() {
    return request({
      url: '/zbms/menu/getMenuClassList',
      method: 'get'
    })
  },
  // 菜单列表获取 通过菜单分类id
  getMenuListByParentId(parentId) {
    return request({
      url: '/zbms/menu/getMenuListByParentId/' + parentId,
      method: 'get'
    })
  }
}
