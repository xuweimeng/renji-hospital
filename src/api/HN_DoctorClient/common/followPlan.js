import fetch from '@/utils/request';

/* 随访计划弹框 *****/
export const FollowPlan = {
  /*
    *获取模态框随访结果
    *taskId:00e656b7-e622-11e7-a153-6cae8b369de4  //计划id
    */
  getVisitOrderDetail(data) {
    return fetch('post', '/wechat/flowUp/getVisitOrderDetail', data);
  }
}
