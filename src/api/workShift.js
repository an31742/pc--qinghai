import request from '@/utils/request'
export default {
  // 交班提交
  pushWorkShift(data) {
    return request({
      url: '/zbms/zbHand/save',
      method: 'post',
      data
    })
  },
  // 交班记录详情
  getWorkShiftInfo(data) {
    return request({
      url: '/zbms/zbInspection/api/detail',
      method: 'get',
      params: data
    })
  },
  // 值班基本信息  接口未完成
  getInfo(pbInfoId) {
    return request({
      url: '/zbms/zbHand/zbInfo',
      method: 'get',
      params: {
        pbInfoId
      }
    })
  }
}
