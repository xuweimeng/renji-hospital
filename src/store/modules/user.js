import { Login } from '@/api/login';
import { getToken, setToken, removeToken, getParameter, setParameter, removeParameter } from '@/utils/auth';

const user = {
  state: {
    token: getToken(),
    name: getParameter('name'),
    avatar: getParameter('avatar'),
    laterhours: getParameter('laterhours'),
    departmentName: getParameter('departmentName'),
    roles: []
  },
  // 操作全局基础用户数据
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    // 设置用户名
    SET_NAME: (state, name) => {
      state.name = name;
    },
    // 设置用户头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    // 设置最后登录时间
    SET_LATERHOURS: (state, laterhours) => {
      state.laterhours = laterhours;
    },
    // 设置部门名字
    SET_DEPARTMENTNAME: (state, departmentName) => {
      state.laterhours = departmentName;
    },
    // 配置路有权限
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit, state }, userInfo) {
      const username = userInfo.username.trim();
      const dataSetting = (response) => {
        const data = response.data;
        // 配置用户id作为token值
        commit('SET_TOKEN', data.id);
        setToken(data.id);
        // 配置用户名
        commit('SET_NAME', data.username);
        setParameter('name', data.username);
        sessionStorage.setItem('userId', data.id)//用户id
        // 配置用户头像
        commit('SET_AVATAR', response.aipictureurl);
        setParameter('avatar', data.aipictureurl);
        // 配置最后登录时间
        commit('SET_LATERHOURS', data.laterhours);
        setParameter('laterhours', data.laterhours);
        // 配置科室名字
        commit('SET_DEPARTMENTNAME', data.departmentName);
        setParameter('departmentName', data.departmentName);
      };
      return new Promise((resolve, reject) => {
        Login.login({
          username: username,
          password: userInfo.password
        })
          .then(response => {
            dataSetting(response);
            resolve();
          })
          .catch(error => {
            Login.newLogin({
              username: username,
              password: userInfo.password
            })
              .then(response => {
                dataSetting(response);
                resolve();
              })
              .catch(error => {
                reject(error);
              });
          });
      });
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      const getInfo = (res, callBack) => {
        setTimeout(() => {
          if (getParameter('name')) {
            let roles = [res.data];
            // 判断是否属于仁济医院.仁济医院分为两个客户端
            if ((res.data).indexOf('仁济') > -1) {
              roles = [res.data + getParameter('departmentName')];
            }
            commit('SET_ROLES', roles);
            callBack(roles);
          } else {
            getInfo();
          }
        }, 2000);
      };
      return new Promise((resolve, reject) => {
        Login.hospatilName().then(res => {
          getInfo(res, resolve);
        }).catch(error => {
          Login.newHospatilName().then(res => {
            getInfo(res, resolve);
          }).catch(error => {
            reject(error);
          });
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        removeToken('Admin-Token');
        commit('SET_TOKEN', '');
        // 清除用户名
        commit('SET_NAME', '');
        removeParameter('name');
        // 清除用户头像
        commit('SET_AVATAR', '');
        removeParameter('avatar');
        // 清除最后登录时间
        commit('SET_LATERHOURS', '');
        removeParameter('laterhours');
        // 清除科室名字
        commit('SET_DEPARTMENTNAME', '');
        removeParameter('departmentName');
        resolve();
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        // 清除用户名
        commit('SET_NAME', '');
        removeParameter('name');
        // 清除用户头像
        commit('SET_AVATAR', '');
        removeParameter('avatar');
        // 清除最后登录时间
        commit('SET_LATERHOURS', '');
        removeParameter('laterhours');
        // 清除科室名字
        commit('SET_DEPARTMENTNAME', '');
        removeParameter('departmentName');
        resolve();
      });
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role);
        setToken(role);
        Login.hospatilName().then(response => {
          const data = response.data;
          commit('SET_ROLES', data.roles);
          commit('SET_NAME', data.name);
          commit('SET_AVATAR', data.avatar);
          commit('SET_INTRODUCTION', data.introduction);
          resolve();
        });
      });
    }
  }
};

export default user;
