import fetch from '@/utils/request';
export const InitiateNotification = {
  /**
   * 即时通知-用户列表接口
   * @param dispatch
   * @param data
   * @returns {Promise.<T>}
   */
  queryCustomerList(data) {
    return fetch('get', '/statistic/examination/select', data);
  },
  /**
   * 即时通知-体检方案接口
   */
  questionScheme(data) {
    return fetch('get', '/visit/questionscheme/list', data);
  },
  /**
   * 体检中心-体检套餐自动补全搜索
   */
  autoComplete(data) {
    return fetch('post', '/visit/disease/autocomplete', data);
  },
  /**
   * 体检随访-确认发起随访
   */
  confirmationFollowUp(data) {
    return fetch('post', '/statistic/examination/notice', data);
  }
};

