import request from '@/utils/request'
// 4A接口
// 人员组织树
export function getUserTree(data) {
  return request({
    url: '/zbms/AAAA/getAAAATree',
    method: 'get',
    params: data
  })
}

// 人员组织树
export function queryUser(data) {
  return request({
    url: '/zbms/AAAA/queryPerson',
    method: 'get',
    params: data
  })
}

// 登录接口
export function login(data) {
  return request({
    url: '/zbms/auth/login',
    method: 'get',
    params: data
  })
}
// 获取用户信息
export function getInfo() {
  return request({
    url: '/zbms/user/detail/info',
    method: 'get'
  })
}

// export function logout() {
//   return request({
//     url: '/vue-element-admin/user/logout',
//     method: 'post'
//   })
// }
