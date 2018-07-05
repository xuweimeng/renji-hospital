import fetch from '@/utils/request';

export const Login = {
  /**
     * @function 获取当前医院名称
     * @param  {type} data {description}
     * @return {type} {description}
     */
  hospatilName(data) {
    return fetch('post', '/client/visit/getYymc', data);
  },
  /**
     * @function 登录接口
     * @param  {type} username {用户账号}
     * @param  {type} password {用户密码}
     * @return {type} {description}
     */
  login(data) {
    return fetch('post', '/client/login/check', data);
  }
};

