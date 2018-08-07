import fetch from '@/utils/request';
export const NoticeResult = {
  /**
   * 特别关注人员添加修改
   * patientId:8251, //患者的id （必填）
   * operateType:1, //(操作类型 1:关注 0：取消关注) （必填）
   * operateTag:老板 //关注的标签
   */
  updateGz(data) {
    return fetch('post', '/inspect/index/updateGz', data);
  },
  /**
   * 体检通知结果详情
   */
  getPatientRecord(data) {
    return fetch('get', '/visit/doctors/resultDetail', data);
    // return fetch('get', '/visit/order/view', data);
  },
  /**
   * 体检中心-体检套餐自动补全搜索
   */
  autoComplete(data) {
    return fetch('post', '/visit/disease/autocomplete', data);
  },
  /**
   *  获取通知计划列表数据
   **/
  resultList(data) {
    return fetch('get', '/physical/order/list', data);
  },
  /*
   *随访计划审核
   *'adminId': this.userId,//医生id
   *'operateType': operateType,//通过(1：不通过 2：通过)
   *'isAll': isAll, //是否全部提交(1:是 2：否)
   *'ids': ids,//患者id,全选多选的是id集合
   *'noPassReason': noPassReason,//审核不通过原因
   */
  editVisitProjectStatus(data) {
    return fetch('post', '/wechat/flowUp/editVisitProjectStatus', data);
  }

};
