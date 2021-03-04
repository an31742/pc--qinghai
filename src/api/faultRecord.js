import request from '@/utils/request'
export default {
  // 值班基本信息
  getZbInfo(data) {
    return request({
      url: '/zbms/zbHand/zbInfo',
      method: 'get',
      parms: data
    })
  },
  // 交班提交
  getRecordFaultList(data) {
    return request({
      url: '/zbms/zbHand/save',
      method: 'post',
      data
    })
  },
  // 交班记录详情
  getRecordFaultInfo(data) {
    return request({
      url: '/zbms/zbRecordLogs/info',
      method: 'get',
      parms: data
    })
  },
  // 保存,新增,修改
  operateRecordFaultList(data) {
    return request({
      url: '/zbms/pbRecordFault/saveRecordFault.do',
      method: 'post',
      data
    })
  }
}
