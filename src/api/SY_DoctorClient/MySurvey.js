import fetch from '@/utils/request';

/* 满意度调查 *****/
export const MySurvey = {
  /**
   * @description 获取门诊，住院计划列表
   * @function queryOrderTaskMYDList
   * @param  {type} adminId {当前用户id}
   * @param  {type} brxm {患者姓名}
   * @param  {type} mobile {联系电话}
   * @param  {type} departmentId {科室ID}
   * @param  {type} medGpId {医疗组ID}
   * @param  {type} VisitStartTimeBegin {计划执行时间开始时间}
   * @param  {type} VisitStartTimeEnd {计划执行时间结束时间}
   * @param  {type} dateAddBegin {就诊(出院)开始时间}
   * @param  {type} dateAddEnd {就诊(出院)结束时间}
   * @param  {type} status {4 待审核 2 不通过 1 审核通过 5 已取消}
   * @param  {type} activeType {6:住院满意度，7：门诊满意度}
   * @param  {type} pager {当前页}
   * @param  {type} limit {每页条数}
   * @return {type} {description}
   */
  queryOrderTaskMYDList(data) {
    return fetch('get', '/wechat/myd/queryOrderTaskMYDList', data);
  },
  /**
   * @description 获取门诊，住院结果列表
   * @function queryOrderTaskMYDList
   * @param  {type} adminId {当前用户id}
   * @param  {type} brxm {患者姓名}
   * @param  {type} mobile {联系电话}
   * @param  {type} departmentId {科室ID}
   * @param  {type} medGpId {医疗组ID}
   * @param  {type} VisitStartTimeBegin {计划执行时间开始时间}
   * @param  {type} VisitStartTimeEnd {计划执行时间结束时间}
   * @param  {type} dateAddBegin {就诊(出院)开始时间}
   * @param  {type} dateAddEnd {就诊(出院)结束时间}
   * @param  {type} status {4 待审核 2 不通过 1 审核通过 5 已取消}
   * @param  {type} activeType {6:住院满意度，7：门诊满意度}
   * @param  {type} pager {当前页}
   * @param  {type} limit {每页条数}
   * @return {type} {description}
   */
  queryResultMYDList(data) {
    return fetch('get', '/wechat/myd/queryResultMYDList', data);
  },
  /**
   * @description 门诊住院结果详情
   * @function resultDetail
   * @param  {type} id {记录id}
   * @return {type} {description}
   */
  resultDetail(data) {
    return fetch('get', '/wechat/myd/resultDetail', data);
  },
  /**
   * @description 获取医疗组
   * @function getGroup
   * @param  {type} data {description}
   * @return {type} {description}
   */
  getGroup(data) {
    return fetch('get', '/visit/myd/GroupName', data);
  },
  /**
   * @description 获取科室
   * @function getDepart
   * @param  {type} data {description}
   * @return {type} {description}
   */
  getDepart(data) {
    return fetch('get', '/wechat/myd/departmentlist', data);
  },
  /**
   * @description 满意度调查结果的导出数据接口
   * @param  {type} data {同列表参数}
   * @param  {type} link
   */
  getLink(data) {
    let resultUrl = '';
    for (const key in data) {
      resultUrl += key + '=' + (data[key] ? data[key] : '') + '&';
    }
    window.open('/wechat/myd/reusltExport?' + resultUrl);
  },
  /**
   * @description 满意度审核接口
   * @function  editVisitProjectStatus
   * @param  {type} adminId {当前用户id}
   * @param  {type} operateType {1：不通过 2：通过}
   * @param  {type} isAll {是否全部提交 1:是 2：否}
   * @param  {type} ids {要修改的随访方案Id(逗号分隔),例如：10017,10019}
   * @param  {type} noPassReason {审核不通过原因,string}
   * @return {type} {description}
   */
  editVisitProjectStatus(data) {
    return fetch('post', '/wechat/updateMYDProjectStatus', data);
  },
  /**
   * @description 满意度调查-统计数据列表
   * @function calculationResult
   * @param  {type} year {（必填）年份,如2018}
   * @param  {type} quarter {（必填）季度（1:第一季度,2:第二季度,3:第三季度,4:第四季度）}
   * @param  {type} activeType {（必填）6:住院满意度，7：门诊满意度}
   * @param  {type} pager {当前页}
   * @param  {type} limit {每页条数}
   * @return {type} {description}
   */
  calculationResult(data) {
    return fetch('get', '/wechat/myd/calculationResult', data);
  },
  /**
   * @description 满意度调查-统计数据列表导出
   * @function calculationResultExport
   * @param  {type} year {（必填）年份,如2018}
   * @param  {type} quarter {（必填）季度（1:第一季度,2:第二季度,3:第三季度,4:第四季度）}
   * @param  {type} activeType {（必填）6:住院满意度，7：门诊满意度}
   * @return {type} {description}
   */
  calculationResultExport(data) {
    let resultUrl = '';
    for (const key in data) {
      resultUrl += key + '=' + (data[key] ? data[key] : '') + '&';
    }
    window.open('/wechat/myd/calculationResultExport?' + resultUrl);
  },
  /**
   * @description 满意度调查-统计数据的select数据
   * @function satisfactionTime
   * @param  {type} activeType {（必填）6:住院满意度，7：门诊满意度}
   * @return {type} {description}
   */
  satisfactionTime(data) {
    return fetch('get', '/wechat/myd/satisfactionTime', data);
  }
}
