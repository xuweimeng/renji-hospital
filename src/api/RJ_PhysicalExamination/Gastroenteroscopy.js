import fetch from '@/utils/request';
export const initiateNotification = {

  /*
  * 胃肠镜通知客户列表
  * adminId:3 //医生id
  * fromsys:h5 //h5或者web
  */
  customerList(data) {
    return fetch('get', '/doctors/Gastroenteroscopy/orderTsakList', data);
  },


  /*
   * 胃肠镜 发起通知点击提交
   * adminId:3 //医生id
   * fromsys:h5 //h5或者web
   */
  GastroenteroscopyTemporary(data) {
    return fetch('post', '/doctors/ordertask/GastroenteroscopyTemporary', data);
  },
  /*
     * 体检方案所有信息展示
     * adminId:3 //医生id
     * fromsys:h5 //h5或者web
     */
  questionschemeList(data) {
    return fetch('get', '/visit/questionscheme/list', data);
  },

  /*
    * POST /doctors/Gastroenteroscopy/customerList 胃肠镜通知客户列表
    * 输入姓名出现对应显示的内容
    * adminId:3 //医生id
    * fromsys:h5 //h5或者web
    */
  inputContent(data) {
    return fetch('post', '/doctors/Gastroenteroscopy/customerList', data);
  },







}
