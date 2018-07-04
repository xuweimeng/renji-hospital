import fetch from '@/utils/request';

/* 患者列表 *****/
export const UpdateTel = {
  /* 修改手机号弹框 *****/
  /**
   * @function 获取两个号码在内存在的正在随访的随访方案
   * @param  {type} data {description}
   * @return {type} {description}
   */
  getProject(data){
    return fetch('post', '/statistic/getTaskByHzxxIdAndPhone', data);
  },
  /**
   * @function 终止随访
   * @param  {type} data {description}
   * @return {type} {description}
   */
  finishProject(data){
    return fetch('post', '/visit/ordertask/cancleall', data);
  },
  /**
   * @function 修改手机号码
   * @param  {type} data {description}
   * @return {type} {description}
   */
  changeMobile(data){
    return fetch('post', '/statistic/upDateHzxxMobile', data);
  },
};
