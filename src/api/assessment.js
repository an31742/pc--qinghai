// 值班考核
import request from '@/utils/request'
export default {
  // 值班考核列表
  queryAssessmentList(query, page) {
    return request({
      url: '/zbms/zbExamine/list',
      method: 'get',
      params: {
        ...query,
        ...page
      }
    })
  },
  // 值班详情三个接口
  // 1值班机房(调用workShift.api中值班基本信息接口)
  // 2值班日志检查
  journalCheck(pbInfoId) {
    return request({
      url: '/zbms/zbExamine/logInfo',
      method: 'get',
      params: {
        pbInfoId
      }
    })
  },
  // 3交接班情况检查
  handoverCheck(pbInfoId) {
    return request({
      url: '/zbms/zbExamine/handInfo',
      method: 'get',
      params: {
        pbInfoId
      }
    })
  },
  // 考核详情保存
  saveAssessment(query) {
    return request({
      url: '/zbms/zbExamine/save',
      method: 'post',
      data: {
        ...query
      }
    })
  },
  // 值班考核统计
  statisticsList(query) {
    return request({
      url: '/zbms/zbExamine/counts',
      method: 'get',
      params: {
        ...query
      }
    })
  }
}
