import fetch from '@/utils/request';
import axios from 'axios';

/** 患者信息 **/
export const hzList = {
  /* 肿瘤科患者列表 */
  list(data) {
    return fetch('post', '/oncology/getOncologyList', data);
  },
  /** 肿瘤科患者列表 */
  getOncologyTempErrorList(data) {
    return fetch('post', '/oncology/getOncologyTempErrorList', data);
  },
  /** 肿瘤科患者列表--未完善信息 **/
  OncologyTempList(data) {
    return fetch('post', '/oncology/OncologyTempList', data);
  },
  /** 肿瘤科患者列表--添加患者 **/
  addOncology(data) {
    return fetch('post', '/oncology/addOncology', data);
  },
  /* 肿瘤科患者列表--完善修改疾病名称 */
  updateOncology(data) {
    return fetch('post', '/oncology/updateOncology', data);
  },
  /* 肿瘤科患者列表--删除 */
  deleteTempById(data) {
    return fetch('post', '/oncology/deleteTempById', data);
  },
  /* 肿瘤科患者列表-保存未完善表 */
  saveOkHzzTemp(data) {
    return fetch('post', '/oncology/saveOkHzzTemp', data);
  },
  /** 肿瘤科患者列表-上传失败 **/
  getOncologyTempErrorList(data) {
    return fetch('post', '/oncology/getOncologyTempErrorList', data);
  },
  /* 肿瘤科患者列表-查看诊断档案时间 */
  getRecordDate(data) {
    return fetch('post', '/oncology/getRecordDate', data);
  },
  /* 肿瘤科患者列表-查看诊断档案 */
  getRecordByDate(data) {
    return fetch('post', '/oncology/getRecordByDate', data);
  },
  /* 肿瘤科患者列表-查看诊断档案断档案顶部的病人信息 */
  getPatientRecord(data) {
    return fetch('post', '/oncology/getPatientRecord', data);
  },
  /* 肿瘤科患者列表-更新患者是死亡还是正常 */
  updateIsLive(data) {
    return fetch('post', '/oncology/updateIsLive', data);
  },
  /* 肿瘤科患者列表-姓名模糊查询 */
  getPatientByName(data) {
    return fetch('post', '/oncology/getPatientByName', data);
  },
  /* 肿瘤科患者列表-修改手机号 */
  upDateHzxxMobile(data) {
    return fetch('post', '/statistic/upDateHzxxMobile', data);
  },
  /* 肿瘤科患者列表-修改手机号是否已有随访计划 */
  getTaskByHzxxIdAndPhone(data) {
    return fetch('post', '/statistic/getTaskByHzxxIdAndPhone', data);
  },
  /* 肿瘤科患者列表-终止所有计划 */
  cancleall(data) {
    return fetch('post', '/visit/ordertask/cancleall', data);
  }
};
/** 肿瘤科患者上传 **/
export const upload = {
  patientUrl: (axios.defaults.baseURL || '') + '/oncology/excel/import'
};
