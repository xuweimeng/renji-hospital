import fetch from '@/utils/request';
/* 异常数据 *****/
export const AbnormalStatistic = {
  /**
   * @description 获取异常数据列表
   * @function list
   * @param  {type} patientName {患者姓名}
   * @param  {type} sex {性别}
   * @param  {type} schemeName {随访方案}
   * @param  {type} mobile {手机号}
   * @param  {type} startDate {随访开始时间-默认当天0点,格式：2018-07-06 00:00}
   * @param  {type} endtDate {随访结束时间-默认当天23:59点,格式：2018-07-06 23:59}
   * @param  {type} diagnoseStartDate {出院开始时间,格式：2018-07-06}
   * @param  {type} diagnoseEndDate {出院结束时间,格式：2018-07-06}
   * @param  {type} pager {当前页}
   * @param  {type} limit {每页条数}
   * @return {type} {description}
   */
  list(data) {
    return fetch('post', '/wechat/VisitResult/getVisistOrderError', data);
  },
  /**
   * @description 导出异常数据列表
   * @function export
   * @param  {type} patientName {患者姓名}
   * @param  {type} sex {性别}
   * @param  {type} schemeName {随访方案}
   * @param  {type} mobile {手机号}
   * @param  {type} startDate {随访开始时间-默认当天0点,格式：2018-07-06 00:00}
   * @param  {type} endtDate {随访结束时间-默认当天23:59点,格式：2018-07-06 23:59}
   * @param  {type} diagnoseStartDate {出院开始时间,格式：2018-07-06}
   * @param  {type} diagnoseEndDate {出院结束时间,格式：2018-07-06}
   * @return {type} {description}
   */
  export(data) {
    let resultUrl = '';
    for (const key in data) {
      resultUrl += key + '=' + (data[key] ? data[key] : '') + '&';
    }
    window.open((process.env.BASE_API ? process.env.BASE_API : '') + '/wechat/VisitResult/exportVisistOrderError?' + resultUrl);
  }
};
