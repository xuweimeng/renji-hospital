import fetch from '@/utils/request';

export const Login = {
  /**
     * @function 获取当前医院名称
     * @param  {type} data {description}
     * @return {type} {description}
     */
  hospatilName(data) {
    return fetch('post', '/client/visit/getYymc', data); // 8084 todo 暂时注释，否则无法使用8084的接口
    // return fetch('post', '/client/visit/getYymc', data);
  },
  /**
     * @function 获取当前医院名称
     * @param  {type} data {description}
     * @return {type} {description}
     */
  newHospatilName(data) {
    // return fetch('post', '/client/visit/getYymc', data); // 8084 todo 暂时注释，否则无法使用8084的接口
    return fetch('post', '/wechat/visit/getYymc', data);
  },
  /**
     * @function 登录接口
     * @param  {type} username {用户账号}
     * @param  {type} password {用户密码}
     * @return {type} {description}
     */
  login(data) {
    return fetch('post', '/client/login/check', data);
  },
  /**
     * @function 登录接口
     * @param  {type} username {用户账号}
     * @param  {type} password {用户密码}
     * @return {type} {description}
     */
  newLogin(data) {
    return fetch('post', '/wechat/login/check', data);
  }
};

