import fetch from '@/utils/request';

/* 患者列表 *****/
export const mixinAPI = {
  /*
   *获取随访结果患者信息
   *visitOrderId:, //visitOrder的id //有orderid就传
   *adminId:be9534bc-e4b7-11e7-a153-6cae8b369de4 //医生id
   *patientId:112129 //患者的id
   */
  getPatientRecord(data) {
    return fetch('post', '/wechat/patientRecord/getPatientRecord', data);
  },
  /*
   *取消/添加关注
   *adminId:4,    //医生的id   （必填）
   *patientId:8251, //患者的id （必填）
   *operateType:1, //(操作类型 1:关注 0：取消关注) （必填）
   *operateTag:老板 //关注的标签
   */
  updateGz(data) {
    return fetch('post', '/wechat/center/updateGz', data);
  }
};
