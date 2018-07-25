import fetch from '@/utils/request';

/**
  入院通知
  **/
export const AdmissionNotice = {
  /*
    入院通知-患者列表接口
    pager:1, //当前页码
    limit:3,//每页条数
    brxm:陈金浩, //病人姓名（可选）
    mobile:15888888, //联系方式（可选）
    beginTime:2018-01-01 00:01:20, //创建开始时间：年月日时分秒(可选)
    endTime:2018-01-10 10:01:20    //创建结束时间：年月日时分秒（可选）
  */
  patList(data) {
    return fetch('get', '/visit/sufferer/select', data);
  },
  /*
  随访方案接口
  page:1, //当前页码
    limit:3,//每页条数
    name:糖尿,//方案名称（可选）
    diseaseId:0, //疾病类型（可选）
    departmentId:899, //指标类型（可选）
    activeType:4      //（必须选）
  */
  planList(data) {
    return fetch('get', '/visit/questionscheme/list', data);
  },
  /**
   * 添加临时随访任务接口
   * @param {any} data
   * @returns
   */
  createNotice(data) {
    return fetch('post', '/visit/order/temp/visit', data);
  },
  /**
 * 入院通知计划
 */
  getPlan(data) {
    return fetch('get', '/visit/ordertask/knubPlanList', data);
  },
  /* 获取疾病列表 */

  getDisease(data) {
    return fetch('post', '/oncology/getdiseasefix', data);
  },
  /* 入院通知计划详情接口 */
  planInfo(data) {
    return fetch('get', '/visit/ordertask/detail', data);
  },
  /* ids:['73125','20121','3190'],                //id
    notPassReason:1,//未通过原因:1,患者已死亡;2,患者不接受随访;3,随访方案重复;4,方案不匹配;
    notPassRemark: //人人健康活百岁
 */
  /* 批量终止通知接口 */
  cancelNotice(data) {
    return fetch('post', '/visit/ordertask/batchcancelall', data);
  },
  /*
    *获取通知结果
    */
  resultList(data) {
    return fetch('get', '/visit/doctors/queryResultList', data);
  },
  /** 入院通知结果详情接口 */
  resultDetail(data) {
    return fetch('get', '/visit/doctors/resultDetail', data);
  },
  /**
   * 一键语音合成 id跟在地址后
   * @param data
   */
  mergeWav(data) {
    return fetch('get', 'merge/wav/'+data.id,'');
  }
};
