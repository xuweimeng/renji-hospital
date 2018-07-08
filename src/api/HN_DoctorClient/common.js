import fetch from '@/utils/request';

/**
 * 多个页面、弹框组件使用到的公用接口
 */
export const CommonAPI = {
  /**
   * @function 获取随访计划详情--使用：随访计划、满意度调查的住院、门诊计划页面的弹框用到
   * @param  {type} taskId {计划id}
   * @return {type} {description}
   */
  getVisitOrderDetail(data) {
    return fetch('post', '/wechat/flowUp/getVisitOrderDetail', data);
  }
}
