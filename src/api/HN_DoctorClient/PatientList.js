import fetch from '@/utils/request';

/* 患者列表 *****/
export const PatientList = {
  /*
  *获取列表
  *adminId:288, //医生的id
  *patientName:, //病人名称
  *icdName:,//所患疾病名称
  *sex:,//男 or 女
  *fromAge:,//起始年龄
  *endAge:,//结束年龄
  *gz:, //0:不关注 1：关注
  *startDate:, //就诊时间的开始时间
  *endDate:,//就诊时间的结束时间
  *sort:0//0:就诊时间从最近到以前; 1:就诊时间从晚到早
  */
  list(data) {
    return fetch('post', '/wechat/center/getMyPatient', data);
  },
  /*
  *获取模态框住院/门诊/随访信息
  */
  // getVisistOrderResult (data) {
  //   return fetch('post', '/wechat/VisitResult/getVisistOrderResult', data);
  // },
  /*
  *获取诊断档案时间
  *adminId:1, //医生的id(无影响)
  *patientId:117227  //病人id
  */
  getRecordDate(data) {
    return fetch('post', '/wechat/patientRecord/getRecordDate', data);
  },
  /*
  *获取诊断档案时间对应的就诊信息
  *atientId:92492, //病人id
  *adminId:3,//医生的id（对查询结果无影响,但必填）
  *date:2015-08-08,//选择的日期
  */
  getRecordByDate(data) {
    return fetch('post', '/wechat/patientRecord/getRecordByDate', data);
  },
  /* 修改手机号弹框 *****/
  /**
   * @function 获取两个号码在内存在的正在随访的随访方案
   * @param  {type} data {description}
   * @return {type} {description}
   */
  getProject(data) {
    return fetch('post', '/statistic/getTaskByHzxxIdAndPhone', data);
  },
  /**
   * @function 终止随访
   * @param  {type} data {description}
   * @return {type} {description}
   */
  finishProject(data) {
    return fetch('post', '/visit/ordertask/cancleall', data);
  },
  /**
   * @function 修改手机号码
   * @param  {type} data {description}
   * @return {type} {description}
   */
  changeMobile(data) {
    return fetch('post', '/statistic/upDateHzxxMobile', data);
  },
};
