import axios from 'axios';
import { Message } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import qs from 'qs';

let baseURL = '';
if (process.env.NODE_ENV === 'development') {
  // baseURL = process.env.BASE_API; // api的base_url
  // baseURL = 'http://192.168.1.218:8084';
  // baseURL = 'http://192.168.1.241:9014';

  // baseURL = 'http://192.168.3.26:8081'; // chanji
  // baseURL = 'http://192.168.3.69:8081'; // fugou
  // baseURL = 'http://192.168.3.33:8087'; // daogou
  // baseURL = 'http://192.168.1.218:8093';
  baseURL = '/api';
  // baseURL = '/api'; // api的base_url
  // baseURL = 'http://60.190.86.50:6016'; // api的base_url
}
// else {
//   baseURL = 'http://192.168.1.218:8084';
// }
// create an axios instance
const service = axios.create({
  baseURL,
  timeout: 50000 // request timeout
});

// 请求参数验证
const JsonData = [
  '/visit/order/temp/visit',
  '/visit/ordertask/batchcancelall',
  'visit/ordertask/vet',
  '/visit/ordertask/physicalTemporary',
  '/visit/ordertask/physicalNewTemporary',
  '/statistic/examination/notice',
  '/visit/check/temp/visit',
  '/statistic/returnVisit/query',
  '/visit/order/vip/clinic',
  '/special/doctor/list',
  '/doctors/special/list',
  '/vist/notice/list'
];

// request interceptor
service.interceptors.request.use(config => {
  // 判断是否是需要使用json数据格式的接口
  let flag = 0;
  for (const item of JsonData) {
    if (config.url.indexOf(item) !== -1) {
      flag++;
      break;
    }
  }
  if (flag > 0) {
    config.headers = {
      'Content-Type': 'application/json;charset=utf-8'
    };
  } else {
    config.data = qs.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    };
  }
  return config;
}, error => {
  // Do something with request error
  Promise.reject(error);
});

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};
/**
 * @function 请求状态码检测
 * @param  {type} response {description}
 * @return {type} {description}
 */
const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  Message({
    message: `请求错误 ${response.status}: ${response.url},${errortext}`,
    type: 'error',
    duration: 5 * 1000
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};
/* 返回一个Promise(发送post请求) */
const fetch = (type, url, params) => {
  return new Promise((resolve, reject) => {
    const data = type === 'get' ? { params: params } : params;
    service[type](url, data)
      .then(checkStatus)
      .then(response => {
        const resultData = JSON.parse(response.data);
        if (resultData.code === 0) {
          resolve(resultData);
        } else if (resultData.code === 1) {
          if (url != '/inspect/index/clientInspectDate' && url != '/inspect/index/clientTotalInspect') {
            Message({
              message: resultData.message,
              type: 'error',
              duration: 5 * 1000
            });
          }
          reject(new Error(resultData.message));
        } else {
          if (resultData.message !== '异常') {
            Message({
              message: resultData.message,
              type: 'error',
              duration: 5 * 1000
            });
          }
          reject(new Error(resultData.message));
        }
      }).catch((error) => {
      reject(error);
    });
  });
};

export default fetch;
