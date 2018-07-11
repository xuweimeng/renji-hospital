import fetch from '@/utils/request';

/**
  出院随访
 **/
export const followUp = {
  /* 肿瘤科--随访计划审核列表 */
  leaveResultPlanList(data) {
    return fetch('get', '/visit/doctors/leaveResultPlanList', data);
  },
  /* 肿瘤科--审核接口 */
  vet(data) {
    return fetch('post', '/visit/ordertask/vet', data);
  },
  /* 肿瘤科--计划审核详情 */
  detail(data) {
    return fetch('get', '/visit/ordertask/detail', data);
  },
  /* 肿瘤科--出院随访结果列表 */
  leaveResultList(data) {
    return fetch('get', '/statistic/visit/doctors/leaveResultList', data);
  },
  /* 肿瘤科--随访记录弹框 */
  view(data) {
    return fetch('get', '/visit/order/view', data);
  },
  /* 肿瘤科--随访结果弹框 */
  getVisistOrderResult(data) {
    return fetch('post', '/visit/doctors/getVisistOrderResult', data);
  },
  /* 肿瘤科--处理结果 */
  leaveResult(data) {
    return fetch('post', '/visit/doctors/leaveResult', data);
  },
  /* 肿瘤科--随访结果呼叫详情 */
  getCallDetail(data) {
    return fetch('get', '/visit/doctors/getCallDetail', data);
  }
};
