import request from '@/utils/request'
export default {
  // 获取所属网络，故障专业，地区

  getSelDicByKinds(data) {
    return request({
      url: '/zbms/dictionary/selDicByKinds',
      method: 'get',
      params: data
    })
  },
  // 故障记录新增保存修改
  saveRecordFault(data) {
    return request({
      url: '/zbms/pbRecordFault/saveRecordFault',
      method: 'post',
      data
    })
  },
  // 获取故障记录列表
  getRecordFaultList(data) {
    return request({
      url: '/zbms/pbRecordFault/recordFaultList',
      method: 'post',
      data
    })
  },
  // 导出故障记录列表
  getExportRecordFaultList(data) {
    return request({
      url: 'zbms/pbRecordFault/exportRecordFaultList',
      responseType: 'blob',
      method: 'post',
      data
    })
  },
  // exportFile(data) {
  //   return request({
  //     url: '/exportRecordFaultList',
  //     method: 'post',
  //     responseType: 'blob',
  //     data
  //   })
  // }
  // 故障记录明细  回显
  getSelRecordDefault(data) {
    return request({
      url: '/zbms/pbRecordFault/selRecordDefault',
      method: 'get',
      params: data
    })
  },
  // 故障记录明细
  delRecordFault(data) {
    return request({
      url: '/zbms/pbRecordFault/delRecordFault',
      method: 'post',
      data
    })
  }
}
