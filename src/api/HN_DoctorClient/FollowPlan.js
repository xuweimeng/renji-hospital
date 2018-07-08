import fetch from '@/utils/request';
/* 随访计划 *****/
export const FollowPlan = {
  /*
  *获取列表
  *'adminId': this.userId,//医生id
  *'status': 4,//(1:已通过 2:未通过 3:已审核 4:未审核)
  *'sex': 性别,
  *'patientName': 病人名称,
  *'icdName': 疾病名称,
  *'fromAge': 开始年龄,
  *'endAge': 结束年龄,
  *'schemeName': 随访方案,
  *'pager': page,
  *'limit': '10'
  */
  list(data) {
    return fetch('post', '/wechat/flowUp/visitProject', data);
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
