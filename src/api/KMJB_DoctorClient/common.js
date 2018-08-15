import fetch from '@/utils/request';

/**
 * 多个页面、弹框组件使用到的公用接口
 */
export const CommonAPI = {
  /**
   * @description 获取随访计划详情--使用：随访计划、满意度调查的住院、门诊计划页面的弹框用到
   * @function getVisitOrderDetail
   * @param  {type} taskId {计划id}
   * @return {type} {description}
   */
  getVisitOrderDetail(data) {
    return fetch('post', '/wechat/flowUp/getVisitOrderDetail', data);
  },
  /**
   * @description 获取患者个人信息--使用：4个弹框组件、满意度调查的住院、门诊计划页面的弹框用到
   * @function getPatientRecord
   * @param  {type} visitOrderId {visitOrderId,有就传，不必须}
   * @param  {type} adminId {用户id}
   * @param  {type} patientId {患者id}
   * @return {type} {description}
   */
  getPatientRecord(data) {
    return fetch('post', '/wechat/patientRecord/getPatientRecord', data);
  },
  /**
   * @description 获取患者列表--使用：首页、患者列表用到
   * @function patientList
   * @param  {type} adminId {当前用户id}
   * @param  {type} patientName {患者姓名}
   * @param  {type} sex {性别}
   * @param  {type} icdName {疾病名称}
   * @param  {type} fromAge {开始年龄}
   * @param  {type} endtAge {结束年龄}
   * @param  {type} schemeName {随访方案名称}
   * @param  {type} pager {当前页}
   * @param  {type} limit {每页条数}
   * @param  {type} gz {tab切换，0全部  1关注}
   * @return {type} {description}
   */
  patientList(data) {
    return fetch('post', '/wechat/center/getMyPatient', data);
  }
}
