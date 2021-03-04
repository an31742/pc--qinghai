// import { asyncRouterMap } from '@/router'
// // import tree from '@/utils/tree'
// function getTreeData(obj, arrT = []) {
//   obj.forEach((item, index) => {
//   // 判断是不是导航路由
//     if (typeof item.hidden === 'undefined') {
//     // 判断是单菜单路由还是多菜单路由
//       if (item.meta) {
//       // 如果有多个子菜单时
//         const obj = { label: item.meta.title, perm: item.meta.perm, children: [] }
//         arrT.push(obj)
//         // 对其children再次执行getTreeData()函数
//         if (item.children) getTreeData(item.children, obj.children)
//       } else {
//         // 如果只有一个子菜单
//         arrT.push({ label: item.children[0].meta.title, perm: item.children[0].meta.perm, children: [] })
//       }
//     }
//   })
//   return arrT
// }
// const tree = getTreeData(asyncRouterMap)
export default [
  // { label: '所有菜单', perm: '*',
  //   children: [
  { label: '工作台', perm: 'workbench' },
  { label: '排班管理', perm: 'workforce',
    children: [
      { label: '排班配置列表', perm: 'workforce:list', parent: 'workforce' },
      { label: '安排排班表', perm: 'workforce:table', parent: 'workforce' }]
  },
  { label: '值班查询', perm: 'dutyInquiry',
    children: [
      { label: '值班日志列表', perm: 'dutyInquiry:log', parent: 'dutyInquiry' },
      { label: '故障记录列表', perm: 'dutyInquiry:record', parent: 'dutyInquiry' }]
  },
  { label: '值班考核', perm: 'dutyAssessment',
    children: [
      { label: '值班考核列表', perm: 'dutyAssessment:assessment', parent: 'dutyAssessment' },
      { label: '值班考核统计', perm: 'dutyAssessment:statistics', parent: 'dutyAssessment' }]
  },
  { label: '基础配置', perm: 'basicConfig',
    children: [
      { label: '值班配置', perm: 'basicConfig:duty', parent: 'basicConfig' },
      { label: '安排排班表', perm: 'basicConfig:room', parent: 'basicConfig' }]
  },
  { label: '系统管理', perm: 'system',
    children: [
      { label: '人员管理', perm: 'system:user', parent: 'system' },
      { label: '角色管理', perm: 'system:role', parent: 'system' }]
  }
  //   ]
  // }
]

// teacher角色的侧边栏都选择一个子项目，但是有的展示父节点，有的不展示
