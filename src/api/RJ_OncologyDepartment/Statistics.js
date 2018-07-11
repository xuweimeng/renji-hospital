import fetch from '@/utils/request';

/**
 数据统计
 */
export const dataStatistics = {
  // 满意度结果列表
  getSatisfactional(data) {
    return fetch('post', '/statistic/satisfactional/getSatisfactional', data)
  },
  // 满意度结果统计
  getSatisfactionalCount(data) {
    return fetch('post', '/statistic/satisfactional/getSatisfactionalCount', data)
  },
  // 指标异常统计列表
  queryAbnormalList(data) {
    return fetch('get', '/statistic/order/queryAbnormalList', data)
  },
  // 异常指标 下拉框
  getIsCheckTarger(data) {
    return fetch('get', '/visit/questiontarget/getIsCheckTarger', data)
  },
  // 数据统计-随访统计列表
  followUpCount(data) {
    return fetch('get', '/statistic/order/list', data)
  },
  // 随访统计情况
  followUpCountDate(data) {
    return fetch('get', '/statistic/order/data', data)
  },
  // 汇总统计暂时
  tabulateStatistics(data) {
    return fetch('post', '/tabulateStatistics', data)
  },
  // 用药依从性统计列表
  queryDrugList(data) {
    return fetch('get', '/statistic/order/queryDrugList', data)
  },
  /** 满意度导出
   * @function {function name}
   * @param  {type} data {description}
   * @return {type} {description}
   */
  exportSatisfyExcel(data) {
    let download_url_params = ( axios.defaults.baseURL || '') + '/statistic/satisfactional/getSatisfactionalexcel?';
    for (const item in data) {
      if (item !== 'pager' && item !== 'limit') {
        download_url_params += (item + '=' + data[item] + '&');
      }
    }
    download_url_params = download_url_params.substring(0,download_url_params.length - 1);
    window.location.href = download_url_params;
  }
};
