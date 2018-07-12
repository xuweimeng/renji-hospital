import fetch from '@/utils/request';

/* 海宁医生端首页 *****/
export const Homepage = {
  /**
   * @description 获取12生肖--ai助手形象
   * @function findAiPictureList
   * @param  {type} adminId {当前用户id}
   * @param  {type} fromsys {h5或者web,海宁医生端传web}
   * @return {type} {description}
   */
  findAiPictureList(data) {
    return fetch('post', '/wechat/center/findAiPictureList', data);
  },
  /**
   * @description 绑定AI头像
   * @function bindAiPicture
   * @param  {type} userId {当前用户id}
   * @param  {type} aiPictureCode {ai助手头像对应的code}
   * @return {type} {description}
   */
  bindAiPicture(data) {
    return fetch('post', '/wechat/center/bindAiPicture', data);
  },
  /**
   * @description 查询首页顶部信息
   * @function adminInfo
   * @param  {type} adminId {当前用户id}
   * @return {type} {description}
   */
  adminInfo(data) {
    return fetch('post', '/wechat/index/adminInfo', data);
  },
  /**
   * @description 疾病分布情况--图表数据
   * @function diagnoseInfo
   * @param  {type} adminId {当前用户id}
   * @param  {type} dateType {默认传1，0:全部 1:一周 2:一个月 3:3个月 4:6个月 5:一年}
   * @return {type} {description}
   */
  diagnoseInfo(data) {
    return fetch('post', '/wechat/index/diagnoseInfo', data);
  },
  /**
   * @description 用药依从性--图表数据
   * @function getUseEatInfo
   * @param  {type} adminId {当前用户id}
   * @param  {type} dateType {默认传1，0:全部 1:一周 2:一个月 3:3个月 4:6个月 5:一年}
   * @return {type} {description}
   */
  getUseEatInfo(data) {
    return fetch('post', '/wechat/index/getUseEatInfo', data);
  },
  /**
   * @description 随访数量统计--图表数据
   * @function visitCountInfo
   * @param  {type} adminId {当前用户id}
   * @param  {type} dateType {默认传1，1:近7天 2:近30天}
   * @return {type} {description}
   */
  visitCountInfo(data) {
    return fetch('post', '/wechat/index/visitCountInfo', data);
  }
}
