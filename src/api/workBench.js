import request from '@/utils/request'
export default {
  // 签到
  signWorkbench(data) {
    return request({
      url: '/zbms/pbRegiste/save',
      method: 'get',
      params: data
    })
  },
  // 是否签到
  isRegiste(data) {
    return request({
      url: '/zbms/pbRegiste/isRegiste',
      method: 'get',
      params: data
    })
  },
  // 公告列表
  getNoticeList(data) {
    return request({
      url: '/zbms/zbNotice/list',
      method: 'get',
      params: data
    })
  },
  // 值班日志列表
  getLogsList(data) {
    return request({
      url: '/zbms/zbLogs/list',
      method: 'get',
      params: data
    })
  },
  // 公告提交
  pushNoticeList(data) {
    return request({

      url: '/zbms/zbNotice/save',
      method: 'post',
      data

    })
  },
  // 值班日志保存 ，修改，新增
  pushLogsList(data) {
    return request({
      url: '/zbms/zbLogs/save',
      method: 'post',
      data

    })
  },
  // 值班日志删除
  removeLogsList(data) {
    return request({
      url: '/zbms/zbLogs/remove',
      method: 'get',
      params: data

    })
  },
  // 值班基本信息
  getZBInfo(data) {
    return request({
      url: '/zbms/zbHand/zbInfo',
      method: 'get',
      params: data

    })
  },
  // 值班文件上传
  pushUpload(data) {
    return request({
      url: '/zbms/uploadFile/api/upload',
      method: 'post',
      data

    })
  }

}
