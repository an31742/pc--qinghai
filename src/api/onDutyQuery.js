// 值班查询
import request from '@/utils/request'
export default {
  // 值班日志列表
  queryQutyList(data) {
    return request({
      url: '/zbms/zbRecordLogs/list',
      method: 'get',
      params: data
    })
  }

}
