import fetch from '@/utils/request';

/** 肿瘤科公用接口 **/
export const commonUrl = {
  // 疾病助记码 -- 禅机
  getdiseasefix(data) {
    return fetch('post', '/oncology/getdiseasefix', data);
  },
  // 疾病自动补全搜索 -- 雄机
  autocomplete(data) {
    return fetch('post', '/visit/disease/autocomplete', data);
  },
  /** 登录 */
  check(data) {
    return fetch('post', '/client/login/check', data);
  },
  /** 意见反馈 */
  sendMessage(data) {
    return fetch('post', '/client/center/sendMessage', data);
  },
  /** 绑定AI助手头像接口 */
  bindAiPicture(data) {
    return fetch('post', '/client/center/bindAiPicture', data);
  },
  /** 查询AI助手头像列表接口 */
  findAiPictureList(data) {
    return fetch('post', '/client/center/findAiPictureList', data);
  },
  /** 特别关注人员添加修改 */
  updateGz(data) {
    return fetch('post', '/inspect/index/updateGz', data);
  }

};
