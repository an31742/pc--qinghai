// 排班管理
import request from '@/utils/request'
export default {
  // 排班配置列表
  getPbList(current, size) {
    return request({
      url: '/zbms/pbConf/list',
      method: 'get',
      params: {
        current,
        size
      }
    })
  },
  // 新增编辑保存
  savePbConf(query) {
    return request({
      url: '/zbms/pbConf/save',
      method: 'post',
      data: {
        ...query
      }
    })
  },
  // 点击编辑时回显数据
  reShow(id) {
    return request({
      url: '/zbms/pbConf/detail',
      method: 'get',
      params: {
        id
      }
    })
  },
  // 安排排班表查询
  queryDayList(query) {
    return request({
      url: '/zbms/pbInfo/list',
      method: 'get',
      params: {
        ...query
      }
    })
  },
  // 安排排班表编辑后保存接口
  saveTimeList(query) {
    return request({
      url: '/zbms/pbInfo/save',
      method: 'post',
      data: [...query]
    })
  },
  // 排班配置列表（机房名称列表）(后期要删，直接调用机房api中的机房列表)
  getRoomList(size, current) {
    return request({
      url: '/zbms/zbRoom/roomList',
      method: 'get',
      params: {
        size,
        current
      }
    })
  },
  // 删除排班配置列表数据
  reMoveData(id) {
    return request({
      url: '/zbms/pbConf/remove',
      method: 'get',
      params: {
        id
      }
    })
  }
}
