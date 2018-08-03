import fetch from '@/utils/request';
/* 随访记录 *****/
export const FollowRecord = {
  /**
   * @description 获取随访记录列表
   * @function list
   * @param  {type} adminId {当前用户id}
   * @param  {type} patientName {患者姓名}
   * @param  {type} sex {性别}
   * @param  {type} icdName {疾病名称}
   * @param  {type} fromAge {开始年龄}
   * @param  {type} endtAge {结束年龄}
   * @param  {type} vetStatus {类型，对应页面的tab切换，1未处理，11已处理}
   * @param  {type} type {时间(必传)：1表示30日(默认)，2表示7日，3表示全部}
   * @param  {type} backStatus {通话状态 1、呼叫失败。2、正常通话。3、通话中。4、关停机。5、无人接听。6、空号。7、号码有误。}
   * @param  {type} scquisitionState {采集状态 1、无异常。2、有异常。3、部分采集。4、接通未采集。5、接通无应答。6、未接通未采集}
   * @param  {type} pager {当前页}
   * @param  {type} limit {每页条数}
   * @param  {type} gz {0不关注  1关注---未使用该字段，页面中无此筛选条件，接口文档中写了}
   * @return {type} {description}
   */
  list(data) {
    return fetch('post', '/wechat/VisitResult/getVisistOrder', data);
  }
};
