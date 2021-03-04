
module.exports = [
  // 安排排班表查询
  {
    url: '/zbms/pb/dayList.do',
    type: 'get',
    response: config => {
      return DAY_LIST
    }
  }
]
const DAY_LIST = {
  code: '0000',
  msg: '',
  data: [
    {
      id: 1,
      processInstId: '1234567890',
      activityDefId: '1',
      createTime: 1595750162,
      createDate: 1595750162,
      activityDefName: '发起申请',
      createUserName: 'lixx',
      createTrueName: '李XX',
      formActiviteRelId: '1'
    },
    {
      id: 2,
      processInstId: '1234567890',
      createTime: 1595750162,
      activityDefId: '2',
      createDate: 1595750162,
      activityDefName: '领导审批',
      createUserName: 'lixx',
      createTrueName: '李XX',
      formActiviteRelId: '2'
    },
    {
      id: 3,
      processInstId: '1234567890',
      createTime: 1595750162,
      activityDefId: '3',
      createDate: 1595750162,
      activityDefName: '归档',
      createUserName: 'lixx',
      createTrueName: '李XX',
      formActiviteRelId: '3'
    }
  ]
}
