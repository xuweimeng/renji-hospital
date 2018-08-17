import fetch from '@/utils/request';

/**
  出院随访
 **/
export const specialDoctor = {
  /* 肿瘤科--特约门诊发起通知
    {
      "doctorId": "19a6419d-9b87-11e8-bea8-005056a77d99", //看疹医生ID
      "adminId": "23b62522-058e-11e8-aef9-005056a9612c",  //登录账号ID（操作者为护士）
      "schemeId": "07595524-a049-11e8-95d3-005056a77d99", //随访方案ID
      "schemeName": "看诊通知", //随访方案名称
      "appointmentTime": "2018-08-17 09:00:00", //看疹预约时间
      "visitTime": "2018-08-18",   //通知时间
      "activeType": "10"   //随访类型  10--特约门诊通知。
    }
  */
  clinic(data) {
    return fetch('post', '/visit/order/vip/clinic', data);
  },
  /*
  随访方案接口
    page:1, //当前页码
    limit:3,//每页条数
    name:糖尿,//方案名称（可选）
    diseaseId:0, //疾病类型（可选）
    departmentId:899, //指标类型（可选）
    activeType:10      //（必须选）
  */
  planList(data) {
    return fetch('get', '/visit/questionscheme/list', data);
  },
  /**
   * @description 通知计划列表
   *  activeType (integer): 类型 9胃肠镜通知;10特约门诊通知 ,
      brxm (string, optional): 医生姓名 ,
      department (string, optional): 医生所属科室 ,
      limit (integer): 每页条数 ,
      mobile (string, optional): 联系电话 ,
      orderTimeEnd (string, optional): 医生预约结束看诊时间 ,
      orderTimeStart (string, optional): 医生预约开始看诊时间 ,
      pager (integer): 分页 ,
      schemeName (string, optional): 方案名称 ,
      status (integer): 1:看诊通知列表 2:已终止通知
   */
  specialList(data) {
    return fetch('post', '/doctors/special/list', data);
  },
  /**
   * @description 通知结果列表
      brxm (string, optional): 医生姓名 ,
      dateEndEnd (string, optional): AI通知结束时间 ,
      dateEndStart (string, optional): AI通知开始时间 ,
      department (string, optional): 医生所属科室 ,
      fieldValue (string, optional): 是否过来，全部传0，来传1，不来传2 ,
      limit (integer): 每页条数 ,
      mobile (string, optional): 联系电话 ,
      pager (integer): 分页 ,
      type (string, optional): 管理台传2，医生端传1 ,
   */
  noticeResultList(data) {
    return fetch('post', '/special/doctor/list', data);
  },
  /**
   * @function 获取详情
   * @param  {type} data {description}
   * @return {type} {description}
   */
  getResultInfo(data) {
    return fetch('post', '/visit/order/view', data);
  }

};
