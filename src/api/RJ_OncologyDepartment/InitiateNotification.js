import fetch from '@/utils/request';

/**
 发起检查通知
 **/
export const InspectionNotice = {
  // 患者所有信息展示
  select(data) {
    return fetch('get', '/visit/sufferer/select', data)
  },
  // 检查项目信息列表展示
  list(data) {
    return fetch('post', '/visit/newDisease/list', data)
  },
  // 检查地点列表展示
  associateId(data) {
    return fetch('post', '/location/list', data)
  },
  // 发起检查
  visit(data) {
    return fetch('post', '/visit/check/temp/visit', data)
  },
  // 检查通知计划查询列表接口
  queryCheckTask(data) {
    return fetch('post', '/queryCheckTask', data)
  },
  // 检查通知计划终止
  stopCheckTask(data) {
    return fetch('post', '/stopCheckTask', data)
  },
  // 检查计划详情
  queryCheckDetail(data) {
    return fetch('post', '/queryCheckDetail', data)
  },
  // 检查通知结果查询列表接口
  clinetQueryCheck(data) {
    return fetch('post', '/clinetQueryCheck', data)
  },
  /**
   * 检查通知-已预约检查项
   */
  checktaskList(data) {
    return fetch('get', '/visit/checktask/list', data);
  }
}