import fetch from '@/utils/request';

/* 满意度调查--住院调查计划 *****/
export const MySurvey = {
  /*
    *获取患者个人信息
    *visitOrderId:, //visitOrder的id //有orderid就传
    *adminId:be9534bc-e4b7-11e7-a153-6cae8b369de4 //医生id
    *patientId:112129 //患者的id
    */
  getPatientRecord(data) {
    return fetch('post', '/wechat/patientRecord/getPatientRecord', data);
  },
  /*
    *获取模态框随访结果
    *taskId:00e656b7-e622-11e7-a153-6cae8b369de4  //计划id
    */
  getVisitOrderDetail(data) {
    return fetch('post', '/wechat/flowUp/getVisitOrderDetail', data);
  },
  /**
   * @description 获取门诊，住院计划列表
   * @function queryOrderTaskMYDList
   * @param  {type} data {description}
   * @return {type} {description}
   */
  queryOrderTaskMYDList (data) {
    return fetch('get', '/wechat/myd/queryOrderTaskMYDList', data);
  },
  /**
   * @description 获取门诊，住院结果列表
   * @function queryResultMYDList
   * @param  {type} data {description}
   * @return {type} {description}
   */
  queryResultMYDList (data) {
    return fetch('get', '/wechat/myd/queryResultMYDList', data);
  },
  /**
   * @description 门诊住院结果详情
   * @function resultDetail
   * @param  {type} data {description}
   * @return {type} {description}
   */
  resultDetail(data){
    return fetch('get', '/wechat/myd/resultDetail', data);
  },
  /**
   * @description 获取医疗组
   * @function getGroup
   * @param  {type} data {description}
   * @return {type} {description}
   */
  getGroup(data){
    return fetch('get', '/visit/myd/GroupName', data);
  },
  getDepart(data){
    return fetch('get', '/wechat/myd/departmentlist', data);
  },
  /**
   * @description 导出数据接口
   * @param  {type} link
   */
  getLink(data){
    let resultUrl="";
    for (const key in data) {
      resultUrl+=key+"="+(data[key]?data[key]:'')+"&";
    }
    window.open((process.env.BASE_API?process.env.BASE_API:"")+'/wechat/myd/reusltExport?'+resultUrl);
  },
  /**
   * 门诊、住院通知结果-统计数据
   */
  calculationResult(data) {
    return fetch('get', '/wechat/myd/calculationResult', data);
  },
  /**
   * （住院，门诊）统计数据导出
   */
  calculationResultExport(data) {
    let resultUrl="";
    for (const key in data) {
      resultUrl+=key+"="+(data[key]?data[key]:'')+"&";
    }
    // console.log(process.env.BASE_API);
    window.open((process.env.BASE_API?process.env.BASE_API:"")+'/wechat/myd/calculationResultExport?'+resultUrl);
  },
  /**
   * 统计数据 查询添加初始化--select数据
   */
  satisfactionTime(data) {
    return fetch('get', '/wechat/myd/satisfactionTime', data);
  },
  /**
   * @function 满意度审核接口
   * @param  {type} data {description}
   * @return {type} {description}
   */
  editVisitProjectStatus(data) {
    return fetch('post', '/wechat/updateMYDProjectStatus', data);
  }
}
