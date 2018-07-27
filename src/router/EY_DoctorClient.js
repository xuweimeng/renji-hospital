
import Layout from '@/views/layout/Layout';

const roles = ['测试系统ey'];

// todo roles的值待改，权限控制
export const EY_DoctorClient = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    meta: { title: '', roles: roles, icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'Home',
        component: () => import('EYDC/Homepage/Homepage.vue'),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/FollowPlan',
    component: Layout,
    meta: { title: 'FollowPlan', roles: roles, icon: 'guide', noCache: true },
    children: [
      {
        path: 'FollowPlanList',
        component: () => import('EYDC/FollowPlan/FollowPlan.vue'),
        name: 'FollowPlan',
        meta: { title: 'FollowPlan', icon: 'guide', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/FollowRecord',
    component: Layout,
    meta: { title: 'FollowRecord', roles: roles, icon: 'documentation', noCache: true },
    children: [
      {
        path: 'FollowRecordList',
        component: () => import('EYDC/FollowRecord/FollowRecord.vue'),
        name: 'FollowRecord',
        meta: { title: 'FollowRecord', icon: 'documentation', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/Patient',
    component: Layout,
    meta: { title: 'Patient', roles: roles, icon: 'list', noCache: true },
    children: [
      {
        path: 'PatientList',
        component: () => import('EYDC/Patientlist/Patientlist.vue'),
        name: 'PatientList',
        meta: { title: 'PatientList', icon: 'list', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/AbnormalStatistic',
    component: Layout,
    meta: { title: 'AbnormalStatistic', roles: roles, icon: 'bug', noCache: true },
    children: [
      {
        path: 'AbnormalStatistic',
        component: () => import('EYDC/AbnormalStatistic/AbnormalStatistic.vue'),
        name: 'AbnormalStatistic',
        meta: { title: 'AbnormalStatistic', icon: 'bug', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/MySurvey',
    component: Layout,
    meta: { title: 'MySurvey', roles: roles, icon: 'form', noCache: true },
    children: [
      {
        path: 'zySurveyPlan',
        component: () => import('EYDC/MySurvey/zySurveyPlan.vue'),
        name: 'zySurveyPlan',
        meta: { title: 'zySurveyPlan', roles: roles, noCache: true }
      },
      {
        path: 'mzSurveyPlan',
        component: () => import('EYDC/MySurvey/mzSurveyPlan.vue'),
        name: 'mzSurveyPlan',
        meta: { title: 'mzSurveyPlan', roles: roles, noCache: true }
      },
      {
        path: 'zySurveyResult',
        component: () => import('EYDC/MySurvey/zySurveyResult.vue'),
        name: 'zySurveyResult',
        meta: { title: 'zySurveyResult', roles: roles, noCache: true }
      },
      {
        path: 'mzSurveyResult',
        component: () => import('EYDC/MySurvey/mzSurveyResult.vue'),
        name: 'mzSurveyResult',
        meta: { title: 'mzSurveyResult', roles: roles, noCache: true }
      },
      {
        path: 'statisticalData',
        component: () => import('EYDC/MySurvey/statisticalData.vue'),
        name: 'statisticalData',
        meta: { title: 'statisticalData', roles: roles, noCache: true }
      }
    ]
  }
];
