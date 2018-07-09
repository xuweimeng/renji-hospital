import fetch from '@/utils/request';
/* 异常数据 *****/
export const AbnormalStatistic = {
  /*
  *获取列表
  */
  list(data) {
    return fetch('post', '/wechat/VisitResult/getVisistOrderError', data);
  },
  /*
  *导出数据
  */
  export(data) {
    let resultUrl = "";
    for (const key in data) {
      resultUrl+=key+"="+(data[key]?data[key]:'')+"&";
    }
    window.open((process.env.BASE_API?process.env.BASE_API:"")+'/wechat/VisitResult/exportVisistOrderError?'+resultUrl);
  }
};
