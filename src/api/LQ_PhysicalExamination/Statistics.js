import fetch from '@/utils/request';

export const Statistics = {
  /**
     * @function 体检统计数据列表
     * @param  {type} data {description}
     * @return {type} {description}
     */
  getHealthExamStatisticList(data) {
    return fetch('post', '/yqly/statistic/getHealthExamStatisticList', data);
  },
  /**
     * @function 登录接口
     * @param  {type} username {用户账号}
     * @param  {type} password {用户密码}
     * @return {type} {description}
     */
  exportHealthExamStatistic: '/yqly/statistic/exportHealthExamStatistic'

};
