import fetch from '@/utils/request';
export const PatientList = {
  /**
   * 患者改约接口：获取体检信息详情
   */
  getPhysicalInfo(data) {
    return fetch('get', '/doctors/getPhysicalInfo', data);
  },
  /**
   * 患者改约接口：确认改约
   */
  updatePhysicalInfo(data) {
    return fetch('post', '/doctors/updatePhysicalInfo', data);
  },
  /**
   * 添加客户列表   activityTo
   */
  addCustomerList(data) {
    return fetch('post', '/doctors/addcustomer', data);
  },
  /**
   * 体检中心-体检套餐自动补全搜索
   */
  autoComplete(data) {
    return fetch('post', '/visit/disease/autocomplete', data);
  },
  /**
   * 客户列表
   * 修改手机号
   */
  updateCustomer(data) {
    return fetch('post', '/doctors/updateCustomer', data);
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
   * 客户档案-基本信息
   * page：1//页码
   * limit：10//条数
   * patientId:288 //客户Id 必传
   */
  clientInformation(data) {
    return fetch('get', '/inspect/index/clientInformation', data);
  },

  /*
 *获取客户列表数据
 *userId:be9534bc-e4b7-11e7-a153-6cae8b369de4 //医生id
 *schemeName:模板 //活动通知名称
 */
  listDate(data) {
    return fetch('post', '/doctors/customerList', data);
  },

  /**
   * 客户档案-历史体检日期
   * patientId:288 //客户Id 必传
   **/

  clientInspectDate(data) {
    return fetch('get', '/inspect/index/clientInspectDate', data);
  },
  /**
   * 特别关注人员添加修改
   * patientId:8251, //患者的id （必填）
   * operateType:1, //(操作类型 1:关注 0：取消关注) （必填）
   * operateTag:老板 //关注的标签
   */

  updateGz(data) {
    return fetch('post', '/inspect/index/updateGz', data);
  }
};
