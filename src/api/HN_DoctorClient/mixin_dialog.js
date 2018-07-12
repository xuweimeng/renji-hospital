import fetch from '@/utils/request';

/* 4个弹框组件公用的接口--mixin.js中调用 *****/
export const mixinAPI = {
  /**
   * @description 取消/添加关注
   * @function updateGz
   * @param  {type} adminId {当前用户id}
   * @param  {type} operateType {操作类型 1:关注 0：取消关注}
   * @param  {type} patientId {患者id}
   * @param  {type} operateTag {关注的标签String}
   * @return {type} {description}
   */
  updateGz(data) {
    return fetch('post', '/wechat/center/updateGz', data);
  }
};
