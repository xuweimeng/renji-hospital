import fetch from '@/utils/request';

/* 患者列表-修改手机号 *****/
export const UpdateTel = {
  /**
   * @description 获取两个号码在内存在的正在随访的随访方案
   * @function getProject
   * @param  {type} patientId {患者id}
   * @param  {type} oldPhone {修改前的手机号}
   * @param  {type} newPhone {要修改成的号码}
   * @return {type} {description}
   */
  getProject(data) {
    return fetch('post', '/statistic/getTaskByHzxxIdAndPhone', data);
  },
  /**
   * @description 终止随访
   * @function finishProject
   * @param  {type} id {表格某行的id}
   * @param  {type} notPassReason {未通过原因:1,患者已死亡;2,患者不接受随访;3,随访方案重复;4,方案不匹配}
   * @param  {type} notPassRemark {备注信息}
   * @return {type} {description}
   */
  finishProject(data) {
    return fetch('post', '/visit/ordertask/cancleall', data);
  },
  /**
   * @description 修改手机号码
   * @function changeMobile
   * @param  {type} patientId {患者id}
   * @param  {type} oldPhone {修改前的手机号}
   * @param  {type} newPhone {要修改成的号码}
   * @return {type} {description}
   */
  changeMobile(data) {
    return fetch('post', '/statistic/upDateHzxxMobile', data);
  }
};
