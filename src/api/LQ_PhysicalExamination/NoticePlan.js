import fetch from '@/utils/request';

export const NoticePlan = {
  /**
   * 体检中心-体检通知计划列表
   */
  getPlan(data) {
    return fetch('get', '/physical/ordertask/list', data);
  },
  /**
   * 体检中心-体检套餐自动补全搜索
   */
  autoComplete(data) {
    return fetch('post', '/visit/disease/autocomplete', data);
  },
  /**
   * 终止通知
   */
  zlistDate(data) {
    return fetch('get', '/physical/ordertask/zlist', data);
  },
  /**
   * 体检通知计划详情接口
   *
   */
  planInfo(data) {
    return fetch('get', '/physical/ordertask/detail', data);
  },
  /*
  *取消/添加关注
  *adminId:4,    //医生的id   （必填）
  *patientId:8251, //患者的id （必填）
  *operateType:1, //(操作类型 1:关注 0：取消关注) （必填）
  *operateTag:老板 //关注的标签
  */
  updateGz(data) {
    return fetch('post', '/inspect/index/updateGz', data);
  },

  /**
   * 已终止单条体检通知计划接口
   */
  cancelNotice(data) {
    return fetch('post', '/visit/ordertask/cancleall', data);
  },
  /**
   * 已批量终止随访接口
   */
  cancelBatchCancel(data) {
    return fetch('post', '/visit/ordertask/batchcancelall', data);
  }

};
