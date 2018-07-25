import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '@/store';
import { getToken } from '@/utils/auth';
import qs from 'qs';

// create an axios instance
const service = axios.create({
  // todo 海宁8084使用
  // baseURL: process.env.BASE_API, // api的base_url
  // baseURL: 'http://192.168.1.218:8093', // api的base_url
  baseURL: 'http://192.168.1.218:8082', // api的base_url
  // baseURL: 'http://60.190.86.50:6016', // api的base_url
  timeout: 50000 // request timeout
});

// 请求参数验证
const JsonData = ['/visit/order/temp/visit', '/visit/ordertask/batchcancelall', 'visit/ordertask/vet', '/visit/ordertask/physicalTemporary', '/visit/ordertask/physicalNewTemporary', '/statistic/examination/notice'];

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
  // console.log(config);
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
});

// respone interceptor
// service.interceptors.response.use(
//   response => response,
//   /**
//    * 下面的注释为通过在response里，自定义code来标示请求状态
//    * 当code返回如下情况则说明权限有问题，登出并返回到登录页
//    * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
//    * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
//    */
//   response => {
//     // const res = response.data;
//     // if (res.code !== 20000) {
//     //   Message({
//     //     message: res.message,
//     //     type: 'error',
//     //     duration: 5 * 1000
//     //   });
//     //   // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
//     //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//     //     // 请自行在引入 MessageBox
//     //     MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
//     //       confirmButtonText: '重新登录',
//     //       cancelButtonText: '取消',
//     //       type: 'warning'
//     //     }).then(() => {
//     //       store.dispatch('FedLogOut').then(() => {
//     //         location.reload(); // 为了重新实例化vue-router对象 避免bug
//     //       });
//     //     });
//     //   }
//     //   return Promise.reject('error');
//     // } else {
//     //   return response.data;
//     // }
//   },
//   error => {
//     console.log('err' + error); // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     });
//     return Promise.reject(error);
//   });

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
        }
        else if (resultData.code === 1) {
            // reject(new Error(resultData.message));
            reject(resultData.message);
        }
        else {
          Message({
            message: resultData.message,
            type: 'error',
            duration: 5 * 1000
          });
          reject(new Error(resultData.message));
        }
      }).catch((error) => {
        reject(error);
      });
  });
};

export default fetch;
