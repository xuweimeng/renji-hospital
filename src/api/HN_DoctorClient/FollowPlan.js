import fetch from '@/utils/request';
/* 随访计划 *****/
export const FollowPlan = {
  /**
   * @description 获取随访计划列表
   * @function list
   * @param  {type} adminId {当前用户id}
   * @param  {type} patientName {患者姓名}
   * @param  {type} sex {性别}
   * @param  {type} schemeName {随访方案}
   * @param  {type} icdName {疾病名称}
   * @param  {type} fromAge {开始年龄}
   * @param  {type} endtAge {结束年龄}
   * @param  {type} status {类型，对应页面的tab切换，1：已通过，2：未通过，3：已审核，4：待审核，5：已取消}
   * @param  {type} pager {当前页}
   * @param  {type} limit {每页条数}
   * @return {type} {description}
   */
  list(data) {
    return fetch('post', '/wechat/flowUp/visitProject', data);
  },
  /**
   * @description 随访计划审核通过/不通过--接口文档是wechat/login/editVisitProjectStatus?
   * @function editVisitProjectStatus
   * @param  {type} adminId {当前用户id}
   * @param  {type} operateType {1：不通过 2：通过}
   * @param  {type} isAll {是否全部提交1:是 2：否}
   * @param  {type} ids {要修改的随访方案Id(逗号分隔),例如：10017,10019}
   * @param  {type} noPassReason {审核不通过原因,string}
   * @return {type} {description}
   */
  editVisitProjectStatus(data) {
    return fetch('post', '/wechat/flowUp/editVisitProjectStatus', data);
  }
};
