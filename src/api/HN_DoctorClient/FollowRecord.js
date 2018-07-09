import fetch from '@/utils/request';
/* 随访计划 *****/
export const FollowRecord = {
  /*
    *获取列表
    * adminId:3 //医生id
    *sex:  //男 女
    *fromAge:  //开始年龄
    *endAge:   //结束年龄
    *patientName: //病人名称
    *icdName:    //疾病名称
    *gz:        //0不关注  1关注
    *vetStatus:    //1未处理，11已处理
    *pager:   //默认1
    *limit:    //默认100
    */
  list(data) {
    return fetch('post', '/wechat/VisitResult/getVisistOrder', data);
  }
};
