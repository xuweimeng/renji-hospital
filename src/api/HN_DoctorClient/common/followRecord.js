import fetch from '@/utils/request';

/* 随访记录弹框 *****/
export const FollowRecord = {
  /**
   * @description 获取模态框随访结果
   * @function getVisistOrderResult
   * @param {String} num {第几次随访}
   * @param {String} taskId {随访taskid}
   * @return {type} {description}
   */
  getVisistOrderResult(data) {
    return fetch('post', '/wechat/VisitResult/getVisistOrderResult', data);
  },
  /**
   * @description 获取随访结果的处理意见
   * @function getDiseaseInfo
   * @param {String} visitOrderId {visitOrderId}
   * @return {type} {description}
   */
  getDiseaseInfo(data) {
    return fetch('post', '/wechat/VisitResult/getDiseaseInfo', data);
  },
  /**
   * @description 提交处理意见
   * @function updateDiseaseInfo
   * @param {String} visitOrderId {visitOrderId}
   * @param {String} diseaseInfo {diseaseInfo(0:病情稳定 1:通知就诊 2:自行处理)}
   * @return {type} {description}
   */
  updateDiseaseInfo(data) {
    return fetch('post', '/wechat/VisitResult/updateDiseaseInfo', data);
  },
  /**
   * @description 指标折线图
   * @function getChartData
   * @param {String} hzxxId {患者的id}
   * @param {String} fieldName {指标名称}
   * @return {type} {description}
   */
  getChartData(data) {
    return fetch('post', '/wechat/VisitResult/getChartData', data);
  }
}
