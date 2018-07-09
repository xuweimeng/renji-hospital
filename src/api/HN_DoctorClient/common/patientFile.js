import fetch from '@/utils/request';

/* 随访计划弹框 *****/
export const PatientFile = {
  /**
   * @function 获取诊断档案时间对应的就诊信息
   * @param {String} patientId {病人id}
   * @param {String} adminId {医生的id（对查询结果无影响,但必填）}
   * @param {String} date {2015-08-08,选择的日期}
   * @return {type} {description}
   */
  getRecordByDate(data) {
    return fetch('post', '/wechat/patientRecord/getRecordByDate', data);
  },
  /**
   * @function 获取诊断档案时间
   * @param {String} patientId {病人id}
   * @param {String} adminId {医生的id（对查询结果无影响,但必填）}
   * @return {type} {description}
   */
  getRecordDate(data) {
    return fetch('post', '/wechat/patientRecord/getRecordDate', data);
  }
}
