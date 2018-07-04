import fetch from '@/utils/request';

/* 随访计划弹框 *****/
export const PatientFile = {
  /*
  *获取诊断档案时间对应的就诊信息
  *atientId:92492, //病人id
  *adminId:3,//医生的id（对查询结果无影响,但必填）
  *date:2015-08-08,//选择的日期
  */
  getRecordByDate(data) {
    return fetch('post', '/wechat/patientRecord/getRecordByDate', data);
  },
  /*
  *获取诊断档案时间
  *adminId:1, //医生的id(无影响)
  *patientId:117227  //病人id
  */
  getRecordDate(data) {
    return fetch('post', '/wechat/patientRecord/getRecordDate', data);
  },
}
