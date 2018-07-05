import fetch from '@/utils/request';
export const home = {
  /*
   *获取12生肖
   *adminId:3 //医生id
   *fromsys:h5 //h5或者web
   */
  findAiPictureList(data) {
    return fetch('post', '/client/center/findAiPictureList', data);
  },
  /**
   * 显示医生记录条数
   */
  getNoticed(data) {
    return fetch('get', '/inspect/index/noticed', data);
  },
  /*
   *绑定AI头像
   *userId//医生的iD
   **aiPictureCode:AiPicture_qlm //ai助手头像对应的code
   */
  bindAiPicture(data) {
    return fetch('post', '/client/center/bindAiPicture', data);
  },
  /*
   *查询顶部信息
   *adminId:288 //医生id
   */
  adminInfo(data) {
    return fetch('post', '/wechat/index/adminInfo', data);
  },
  /**
   * 客户总体情况信息-套餐分布信息
   * dateType：1 //日期类型 (0:全部 1:一周7天 2:一个月 3:3个月 4:6个月 5:一年)
   */
  clientDistribute(data) {
    return fetch('get', '/inspect/index/clientDistribute', data);
  },
  /**
   * 客户总体情况信息-到院情况信息
   *   dateType：1 //日期类型 (0:全部 1:一周7天 2:一个月 3:3个月 4:6个月 5:一年)
   */
  arriveHospital(data) {
    return fetch('get', '/inspect/index/arriveHospital', data);
  },
  /**
   * 统计7天或30天体检通知数量
   * "type":1 //日期类型，1：7天，2:30天
   */
  noticedCountDate(data) {
    return fetch('get', '/inspect/index/noticedCountDate', data);
  },
  /**
   * 特别关注人员展示
   *  page：1//页码
   *  limit：10//条数
   */
  specialClient(data) {
    return fetch('get', '/inspect/index/specialClient', data);
  },
  /**
   * 客户档案-历史体检日期
   * patientId:288 //客户Id 必传
   **/

  clientInspectDate(data) {
    return fetch('get', '/inspect/index/clientInspectDate', data);
  },
  /**
   * 客户档案-基本信息
   * page：1//页码
   * limit：10//条数
   * patientId:288 //客户Id 必传
   */
  clientInformation(data) {
    return fetch('get', '/inspect/index/clientInformation', data);
  },
  /**
   * 客户档案-体检项目信息
   * page：1//页码
   * limit：10//条数
   * patientId:288 //客户Id 必传
   * date：2018-03-12// 体检日期(必传)
   * identificationCard：13313123//身份证号 (该患者有身份证号就传)
   */

  clientTotalInspect(data) {
    return fetch('get', '/inspect/index/clientTotalInspect', data);
  },

  /**
   * 特别关注人员添加修改
   * patientId:8251, //患者的id （必填）
   * operateType:1, //(操作类型 1:关注 0：取消关注) （必填）
   * operateTag:老板 //关注的标签
   */

  updateGz(data) {
    return fetch('post', '/inspect/index/updateGz', data);
  },
  /*
     *处理意见
     *visitOrderId:10000 //orderId
     *diseaseInfo:0(0:病情稳定 1:通知就诊 2:自行处理)
     */
  updateDiseaseInfo(data) {
    return fetch('post', '/wechat/VisitResult/updateDiseaseInfo', data);
  },
  /**
   * 获取随访结果处理意见
   * visitOrderId: 随访id
   */
  getDiseaseInfo(data) {
    return fetch('post', '/wechat/VisitResult/getDiseaseInfo', data);
  },
  /*
   *指标折线图
   * hzxxId:3, //患者的id
   *fieldName:'下午血压'  //指标名称
   */
  getChartData(data) {
    return fetch('post', '/wechat/VisitResult/getChartData', data);
  }
};
