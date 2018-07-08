import fetch from '@/utils/request';

/* 海宁医生端首页 *****/
export const Homepage = {
  /*
    *获取12生肖
    *adminId:3 //医生id
    *fromsys:h5 //h5或者web
    */
  findAiPictureList(data) {
    return fetch('post', '/wechat/center/findAiPictureList', data);
  },
  /*
    *绑定AI头像
    *userId//医生的iD
    **aiPictureCode:AiPicture_qlm //ai助手头像对应的code
    */
  bindAiPicture(data) {
    return fetch('post', '/wechat/center/bindAiPicture', data);
  },
  /*
    *查询顶部信息
    *adminId:288 //医生id
    */
  adminInfo(data) {
    return fetch('post', '/wechat/index/adminInfo', data);
  },
  /*
    *疾病分类信息统计
    *adminId:3 //医生id
    *dateType:0  //(0:全部 1:一周 2:一个月 3:3个月 4:6个月 5:一年)
    */
  diagnoseInfo(data) {
    return fetch('post', '/wechat/index/diagnoseInfo', data);
  },
  /*
    *用药依从性统计
    *adminId:3 //医生id
    *dateType:0  //(0:全部 1:一周 2:一个月 3:3个月 4:6个月 5:一年)
    */
  getUseEatInfo(data) {
    return fetch('post', '/wechat/index/getUseEatInfo', data);
  },
  /*
    *随访次数统计
    *adminId:3 //医生id
    *dateType:2 //1:近7天 2:近30天
    */
  visitCountInfo(data) {
    return fetch('post', '/wechat/index/visitCountInfo', data);
  },
  /*
  *获取列表  特别关心患者列表
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
  }
}
