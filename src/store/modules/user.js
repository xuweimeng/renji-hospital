import { Login } from '@/api/login';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { setInterval } from 'timers';

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    // 配置
    setting: {
      articlePlatform: []
    }
  },
  // 操作全局基础用户数据
  mutations: {
    SET_CODE: (state, code) => {
      state.code = code;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
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
      return new Promise((resolve, reject) => {
        Login.login({
          username: username,
          password: userInfo.password
        })
          .then(response => {
            const data = response.data;
            // 配置用户id作为token值
            commit('SET_TOKEN', data.id);
            setToken(data.id);
            // response.data.roles = [response.data.departmentName];
            localStorage.setItem('userInfo', JSON.stringify(response));
            sessionStorage.setItem('userId', response.data.id); // 用户id
            sessionStorage.setItem('laterhours', response.laterhours);// 距离上次登录
            sessionStorage.setItem('realname', response.data.realname); // 姓名
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        Login.hospatilName().then(res => {
          const getInfo = () => {
            setTimeout(() => {
              const response = JSON.parse(localStorage.getItem('userInfo'));
              const data = response.data;
              if (data.username) {
                let roles = [res.data];
                // 判断是否属于仁济医院.仁济医院分为两个客户端
                if (res.data.indexOf('仁济') > -1) {
                  roles = [res.data + data.departmentName];
                }
                commit('SET_ROLES', roles);
                commit('SET_NAME', data.username);
                commit('SET_AVATAR', response.aipictureurl);
                commit('SET_INTRODUCTION', data.realname);
                resolve(response);
              } else {
                getInfo();
              }
            }, 2000);
          };
          getInfo();
          console.log(res);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        removeToken('Admin-Token');
        commit('SET_TOKEN', '');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('realname');
        sessionStorage.removeItem('laterhours');
        localStorage.removeItem('userInfo');
        resolve();
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken('Admin-Token');
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('realname');
        sessionStorage.removeItem('laterhours');
        localStorage.removeItem('userInfo');
        resolve();
      });
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role);
        setToken(role);
        getUserInfo(role).then(response => {
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
