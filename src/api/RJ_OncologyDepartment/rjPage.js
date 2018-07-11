import fetch from '@/utils/request';

/**
 肿瘤科首页
 **/
export const rjPage = {
  /** 首页查询顶部信息入口 */
  adminInfo(data) {
    return fetch('post', '/oncology/adminInfo', data);
  },
  /** 首页随访次数统计接口 */
  visitCountInfo(data) {
    return fetch('post', '/oncology/visitCountInfo', data);
  },
  /** 疾病分类信息统计 */
  diagnoseInfo(data) {
    return fetch('post', '/oncology/diagnoseInfo', data);
  },
  /** 首页疾病分类信息统计 */
  getUseEatInfo(data) {
    return fetch('post', '/oncology/getUseEatInfo', data);
  },
  /** 特别关注人员展示 */
  getMyPatient(data) {
    return fetch('post', '/client/center/getMyPatient', data);
  },
  /** 特别关注人员展示 */
  showTopPage(data) {
    return fetch('get', '/statistic/order/showTopPage', data);
  }
};
