import fetch from '@/utils/request';

/* 数据报表 *****/
export const DataAddUp = {
  /**
   * @description 回访统计列表
   * @function query
   * @param {Array} backStatuss {[1,2,3,4,5,6,7]  通话状态}
   * @param {Array} fieldValues {[0] 接听人身份 [0]代表全部}
   * @param {String} dateEndBegin {开始时间}
   * @param {String} dateEndEnd {结束时间}
   * @param {String} pager {第几页}
   * @param {String} limit {每页条数}
   * @param data
   */
  query(data) {
    return fetch('post', '/statistic/returnVisit/query', data);
  },
  /**
   * @description 回访统计列表导出
   * @function returnVisitExport
   * @param {Array} backStatuss {[1,2,3,4,5,6,7]  通话状态}
   * @param {Array} fieldValues {[0] 接听人身份 [0]代表全部}
   * @param {String} dateEndBegin {开始时间}
   * @param {String} dateEndEnd {结束时间}
   * @param data
   */
  returnVisitExport(data) {
    let resultUrl = '';
    for (const key in data) {
      resultUrl += key + '=' + (data[key] ? data[key] : '') + '&';
    }
    window.open('/statistic/returnVisit/export?' + resultUrl);
  },
  /**
   * @description 短信统计列表
   * @function selectByTime
   * @param {String} type {1:按日汇总 2:按月汇总}
   * @param {String} year {需要汇总的年}
   * @param {String} month {month}
   * @param data
   */
  selectByTime(data) {
    return fetch('get', '/statistic/wechar/selectByTime', data);
  }
};
