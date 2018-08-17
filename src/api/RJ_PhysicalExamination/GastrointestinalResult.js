import fetch from '@/utils/request';
export const GastrointestinalResult = {

  /*
  * 胃肠镜通知结果列表
  * adminId:3 //医生id
  * fromsys:h5 //h5或者web
  */
  GastrointestinalResult(data) {
    return fetch('post', '/vist/notice/list', data);
  },


}
