import { Login } from '@/api/login';
import { getToken, setToken, removeToken, getParameter, setParameter, removeParameter } from '@/utils/auth';

const SCOPE_ROW_DATA = 'SCOPE_ROW_DATA';

const user = {
  state: {
    token: getToken(),
    name: getParameter('name'),
    avatar: getParameter('avatar'),
    laterhours: getParameter('laterhours'),
    departmentName: getParameter('departmentName'),
    hospatil: getParameter('hospital'),
    roles: [],
    scopeRowData: {}, // 表格点击操作按钮传递scope.row的数据
    visitTime: '', // 随访结果的时间
    uploadNum: {
      data: {

      }
    } // 患者列表批量上传上传成功失败个数
  },
  // 操作全局基础用户数据
  mutations: {
    SET_TOKEN: (state, token) => {
      sessionStorage.setItem('userId', token);
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
      state.departmentName = departmentName;
    },
    // 设置医院名称
    SET_HOSPITAL: (state, hospital) => {
      state.hospital = hospital;
    },
    // 配置路有权限
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    // 表格scope.row.data
    SCOPE_ROW_DATA: (state, scopeRowData) => {
      state.scopeRowData = scopeRowData;
    },
    // 个人档案的随访日期
    VISIT_TIME: (state, visitTime) => {
      state.visitTime = visitTime;
    },
    // 患者列表批量上传上传成功失败个数
    UPLOADNUM: (state, uploadNum) => {
      state.uploadNum = uploadNum;
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
        sessionStorage.setItem('userId', data.id);// 用户id
        sessionStorage.setItem('laterhours', response.laterhours);// 用户等待时间
        // 配置用户头像
        commit('SET_AVATAR', response.aipictureurl);
        setParameter('avatar', data.aipictureurl);
        // 配置最后登录时间
        commit('SET_LATERHOURS', data.laterhours);
        setParameter('laterhours', response.laterhours);
        sessionStorage.setItem('dateLogin', data.dateLogin); // 上次登录时间
        // 配置科室名字
        commit('SET_DEPARTMENTNAME', data.departmentName);
        setParameter('departmentName', data.departmentName);
        // yugou 设置海宁医生端的type，用来判断满意度模块是否显示
        setParameter('hn_type', `海宁市中心医院type${response.data.type}`);
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
          .catch(() => {
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
            // 海宁的特殊权限处理
            if ((res.data).indexOf('海宁') > -1) {
              roles = [...roles, getParameter('hn_type')];
            }
            commit('SET_ROLES', roles);
            commit('SET_HOSPITAL', res.data);
            setParameter('hospital', res.data);
            callBack(roles);
          } else {
            getInfo();
          }
        }, 100);
      };
      return new Promise((resolve, reject) => {
        Login.hospatilName().then(res => {
          document.title = res.data; // 2018/7/25 隔鸡新增
          getInfo(res, resolve);
        }).catch(() => {
          Login.newHospatilName().then(res => {
            document.title = res.data; // 2018/7/25 隔鸡新增
            getInfo(res, resolve);
          }).catch(error => {
            reject(error);
          });
        });
      });
    },

    // 获取医院信息
    GetHospital({ commit, state }) {
      const hospitalMap = {
        海宁市中心医院: require('../../assets/login/haining.png'),
        上海市仁济医院: require('../../assets/login/renji.png'),
        乐清六院: require('../../assets/login/leqing.png'),
        昆明金碧社区医院: require('../../assets/login/kunmingjinbi.png')
      };
      const getInfo = (res, callBack) => {
        document.title = res.data;
        callBack(hospitalMap[res.data]);
      };
      return new Promise((resolve, reject) => {
        Login.hospatilName().then(res => {
          document.title = res.data; // 2018/7/25 隔鸡新增
          getInfo(res, resolve);
        }).catch(() => {
          Login.newHospatilName().then(res => {
            document.title = res.data; // 2018/7/25 隔鸡新增
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
    },

    // 同步scope.row.data
    getScopeRowData({ commit }, scopeRowData) {
      commit('SCOPE_ROW_DATA', scopeRowData);
    },

    // 获取个人档案的随访日期(默认获取第一个)
    getVisitTime({ commit }, visitTime) {
      commit('VISIT_TIME', visitTime);
    },

    // 获取个人档案的随访日期(默认获取第一个)
    getUploadNum({ commit }, uploadNum) {
      commit('UPLOADNUM', uploadNum);
    }

  }
};

export default user;
