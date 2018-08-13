
import Layout from '@/views/layout/Layout';

// const roles = ['测试系统'];
const roles = ['上海十院']; // 首页
// const roles_not_type3 = ['海宁市中心医院type0', '海宁市中心医院type1', '海宁市中心医院type2']; // 随访计划、随访记录、患者列表、异常数据
// const role_survey = ['海宁市中心医院type0', '海宁市中心医院type3']; // 满意度

// todo roles的值待改，权限控制
export const SY_DoctorClient = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    meta: { title: '', roles: roles, icon: 'dashboard', noCache: true },
    children: [
      // {
      //   path: 'Home',
      //   component: () => import('SYDC/Homepage/Homepage.vue'),
      //   name: 'Home',
      //   meta: { title: 'Home', icon: 'dashboard', roles: roles, noCache: true }
      // },
      {
        path: 'Home',
        component: () => import('SYDC/Homepage/Index.vue'),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/FollowPlan',
    component: Layout,
    meta: { title: 'FollowPlan', roles: roles_not_type3, icon: 'guide', noCache: true },
    children: [
      {
        path: 'FollowPlanList',
        component: () => import('SYDC/FollowPlan/FollowPlan.vue'),
        name: 'FollowPlan',
        meta: { title: 'FollowPlan', icon: 'guide', roles: roles_not_type3, noCache: true }
      }
    ]
  },
  {
    path: '/FollowRecord',
    component: Layout,
    meta: { title: 'FollowRecord', roles: roles_not_type3, icon: 'documentation', noCache: true },
    children: [
      {
        path: 'FollowRecordList',
        component: () => import('SYDC/FollowRecord/FollowRecord.vue'),
        name: 'FollowRecord',
        meta: { title: 'FollowRecord', icon: 'documentation', roles: roles_not_type3, noCache: true }
      }
    ]
  },
  {
    path: '/Patient',
    component: Layout,
    meta: { title: 'Patient', roles: roles_not_type3, icon: 'list', noCache: true },
    children: [
      {
        path: 'PatientList',
        component: () => import('SYDC/Patientlist/Patientlist.vue'),
        name: 'PatientList',
        meta: { title: 'PatientList', icon: 'list', roles: roles_not_type3, noCache: true }
      }
    ]
  },
  {
    path: '/AbnormalStatistic',
    component: Layout,
    meta: { title: 'AbnormalStatistic', roles: roles_not_type3, icon: 'bug', noCache: true },
    children: [
      {
        path: 'AbnormalStatistic',
        component: () => import('SYDC/AbnormalStatistic/AbnormalStatistic.vue'),
        name: 'AbnormalStatistic',
        meta: { title: 'AbnormalStatistic', icon: 'bug', roles: roles_not_type3, noCache: true }
      }
    ]
  },
  {
    path: '/MySurvey',
    component: Layout,
    meta: { title: 'MySurvey', roles: role_survey, icon: 'form', noCache: true },
    children: [
      {
        path: 'zySurveyPlan',
        component: () => import('SYDC/MySurvey/zySurveyPlan.vue'),
        name: 'zySurveyPlan',
        meta: { title: 'zySurveyPlan', roles: role_survey, noCache: true }
      },
      {
        path: 'mzSurveyPlan',
        component: () => import('SYDC/MySurvey/mzSurveyPlan.vue'),
        name: 'mzSurveyPlan',
        meta: { title: 'mzSurveyPlan', roles: role_survey, noCache: true }
      },
      {
        path: 'zySurveyResult',
        component: () => import('SYDC/MySurvey/zySurveyResult.vue'),
        name: 'zySurveyResult',
        meta: { title: 'zySurveyResult', roles: role_survey, noCache: true }
      },
      {
        path: 'mzSurveyResult',
        component: () => import('SYDC/MySurvey/mzSurveyResult.vue'),
        name: 'mzSurveyResult',
        meta: { title: 'mzSurveyResult', roles: role_survey, noCache: true }
      },
      {
        path: 'statisticalData',
        component: () => import('SYDC/MySurvey/statisticalData.vue'),
        name: 'statisticalData',
        meta: { title: 'statisticalData', roles: role_survey, noCache: true }
      }
    ]
  }
];
