import request from '@/utils/request'
export default {
  // 值班巡检提交
  pushVisitRecord(data) {
    return request({
      url: '/zbms/zbInspection/api/save',
      method: 'post',
      data
    })
  },
  // 值班巡检详情

  getVisitRecordDeatil(data) {
    return request({
      url: '/zbms/zbInspection/api/detail',
      method: 'get',
      params: data
    })
  },

  getmultiLogs(data) {
    return request({
      url: '/zbms/zbInspection/api/multiLogs',
      method: 'get',
      params: data
    })
  }

}
