
import Layout from '@/views/layout/Layout';

const roles = ['海宁市中心医院'];

// todo roles的值待改，权限控制
export const HN_DoctorClient = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    meta: { title: '', roles: roles, icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'Home',
        component: () => import('HNDC/Homepage/Homepage.vue'),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', roles: roles, noCache: true }
      },
      {
        path: 'Index',
        component: () => import('HNDC/Homepage/Index.vue'),
        name: 'HomeNew',
        meta: { title: 'HomeNew', icon: 'dashboard', roles: roles, noCache: true }
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
        component: () => import('HNDC/FollowPlan/FollowPlan.vue'),
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
        component: () => import('HNDC/FollowRecord/FollowRecord.vue'),
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
        component: () => import('HNDC/Patientlist/Patientlist.vue'),
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
        component: () => import('HNDC/AbnormalStatistic/AbnormalStatistic.vue'),
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
        component: () => import('HNDC/MySurvey/zySurveyPlan.vue'),
        name: 'zySurveyPlan',
        meta: { title: 'zySurveyPlan', roles: roles, noCache: true }
      },
      {
        path: 'mzSurveyPlan',
        component: () => import('HNDC/MySurvey/mzSurveyPlan.vue'),
        name: 'mzSurveyPlan',
        meta: { title: 'mzSurveyPlan', roles: roles, noCache: true }
      },
      {
        path: 'zySurveyResult',
        component: () => import('HNDC/MySurvey/zySurveyResult.vue'),
        name: 'zySurveyResult',
        meta: { title: 'zySurveyResult', roles: roles, noCache: true }
      },
      {
        path: 'mzSurveyResult',
        component: () => import('HNDC/MySurvey/mzSurveyResult.vue'),
        name: 'mzSurveyResult',
        meta: { title: 'mzSurveyResult', roles: roles, noCache: true }
      },
      {
        path: 'statisticalData',
        component: () => import('HNDC/MySurvey/statisticalData.vue'),
        name: 'statisticalData',
        meta: { title: 'statisticalData', roles: roles, noCache: true }
      }
    ]
  }
];
