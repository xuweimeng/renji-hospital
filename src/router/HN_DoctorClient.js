
import Layout from '@/views/layout/Layout';

const roles = roles;

// todo roles的值待改，权限控制
export const HN_DoctorClient = [
  {
    path: '/HomeHN',
    component: Layout,
    meta: { title: 'HomeHN', roles: roles, icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'HomepageHN',
        component: () => import('HNDC/Homepage/Homepage.vue'),
        name: 'HomepageHN',
        meta: { title: 'HomepageHN', icon: 'dashboard', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/FollowPlanHN',
    component: Layout,
    meta: { title: 'FollowPlanHN', roles: roles, icon: 'guide', noCache: true },
    children: [
      {
        path: 'FollowPlanListHN',
        component: () => import('HNDC/FollowPlan/FollowPlan.vue'),
        name: 'FollowPlanHN',
        meta: { title: 'FollowPlanHN', icon: 'guide', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/FollowRecordHN',
    component: Layout,
    meta: { title: 'FollowRecordHN', roles: roles, icon: 'documentation', noCache: true },
    children: [
      {
        path: 'FollowRecordListHN',
        component: () => import('HNDC/FollowRecord/FollowRecord.vue'),
        name: 'FollowRecordHN',
        meta: { title: 'FollowRecordHN', icon: 'documentation', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/PatientHN',
    component: Layout,
    meta: { title: 'PatientHN', roles: roles, icon: 'list', noCache: true },
    children: [
      {
        path: 'PatientListHN',
        component: () => import('HNDC/Patientlist/Patientlist.vue'),
        name: 'PatientListHN',
        meta: { title: 'PatientListHN', icon: 'list', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/AbnormalStatisticHN',
    component: Layout,
    meta: { title: 'AbnormalStatisticHN', roles: roles, icon: 'bug', noCache: true },
    children: [
      {
        path: 'AbnormalStatisticHN',
        component: () => import('HNDC/AbnormalStatistic/AbnormalStatistic.vue'),
        name: 'AbnormalStatisticHN',
        meta: { title: 'AbnormalStatisticHN', icon: 'bug', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/MySurveyHN',
    component: Layout,
    meta: { title: 'MySurveyHN', roles: roles, icon: 'form', noCache: true },
    children: [
      {
        path: 'zySurveyPlanHN',
        component: () => import('HNDC/MySurvey/zySurveyPlan.vue'),
        name: 'zySurveyPlanHN',
        meta: { title: 'zySurveyPlanHN', roles: roles, noCache: true }
      },
      {
        path: 'mzSurveyPlanHN',
        component: () => import('HNDC/MySurvey/mzSurveyPlan.vue'),
        name: 'mzSurveyPlanHN',
        meta: { title: 'mzSurveyPlanHN', roles: roles, noCache: true }
      },
      {
        path: 'zySurveyResultHN',
        component: () => import('HNDC/MySurvey/zySurveyResult.vue'),
        name: 'zySurveyResultHN',
        meta: { title: 'zySurveyResultHN', roles: roles, noCache: true }
      },
      {
        path: 'mzSurveyResultHN',
        component: () => import('HNDC/MySurvey/mzSurveyResult.vue'),
        name: 'mzSurveyResultHN',
        meta: { title: 'mzSurveyResultHN', roles: roles, noCache: true }
      },
      {
        path: 'statisticalDataHN',
        component: () => import('HNDC/MySurvey/statisticalData.vue'),
        name: 'statisticalDataHN',
        meta: { title: 'statisticalDataHN', roles: roles, noCache: true }
      }
    ]
  },
];
