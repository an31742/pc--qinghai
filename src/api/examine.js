import request from '@/utils/request'
export default {
  // 值班考核统计
  getExame(data) {
    return request({
      url: '/examine.do',
      method: 'get',
      params: data
    })
  },
  // 值班考核列表
  getExameList(data) {
    return request({
      url: '/zbms/zbExamine/list',
      method: 'get',
      params: data
    })
  },
  // 考核
  getExameSave(data) {
    return request({
      url: '/examine/save.do',
      method: 'post',
      data
    })
  }
}
