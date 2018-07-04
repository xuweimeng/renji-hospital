import fetch from '@/utils/request';

/* 随访计划弹框 *****/
export const FollowRecord = {
  /*
    *获取模态框随访结果
    *taskId:33951,//执行任务的id
    *num:1  //第几次
    */
  getVisistOrderResult(data) {
    return fetch('post', '/wechat/VisitResult/getVisistOrderResult', data);
  },
  /**
   * 获取随访结果处理意见
   * visitOrderId: 随访id
   */
  getDiseaseInfo(data) {
    return fetch('post', '/wechat/VisitResult/getDiseaseInfo', data);
  },
  /*
    *处理意见
    *visitOrderId:10000 //orderId
    *diseaseInfo:0(0:病情稳定 1:通知就诊 2:自行处理)
    */
  updateDiseaseInfo(data) {
    return fetch('post', '/wechat/VisitResult/updateDiseaseInfo', data);
  },
  /*
    *指标折线图
    * hzxxId:3, //患者的id
    *fieldName:'下午血压'  //指标名称
    */
  getChartData(data) {
    return fetch('post', '/wechat/VisitResult/getChartData', data);
  }
}
