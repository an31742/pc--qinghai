import request from '@/utils/request'
export default {
  // 机房列表
  getRoomList(data) {
    return request({
      url: '/zbms/zbRoom/roomList',
      method: 'get',
      params: data
    })
  }

}
