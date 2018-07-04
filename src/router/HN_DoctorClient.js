
import Layout from '@/views/layout/Layout';
// todo roles的值待改，权限控制
export const HN_DoctorClient = [
  {
    path: '/HomeHN',
    component: Layout,
    meta: { title: 'HomeHN', roles: ['健康保健中心'], icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'HomepageHN',
        component: () => import('HNDC/Homepage/Homepage.vue'),
        name: 'HomepageHN',
        meta: { title: 'HomepageHN', icon: 'dashboard', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
  {
    path: '/FollowPlanHN',
    component: Layout,
    meta: { title: 'FollowPlanHN', roles: ['健康保健中心'], icon: 'guide', noCache: true },
    children: [
      {
        path: 'FollowPlanListHN',
        component: () => import('HNDC/FollowPlan/FollowPlan.vue'),
        name: 'FollowPlanHN',
        meta: { title: 'FollowPlanHN', icon: 'guide', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
  {
    path: '/FollowRecordHN',
    component: Layout,
    meta: { title: 'FollowRecordHN', roles: ['健康保健中心'], icon: 'documentation', noCache: true },
    children: [
      {
        path: 'FollowRecordListHN',
        component: () => import('HNDC/FollowRecord/FollowRecord.vue'),
        name: 'FollowRecordHN',
        meta: { title: 'FollowRecordHN', icon: 'documentation', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
  {
    path: '/PatientHN',
    component: Layout,
    meta: { title: 'PatientHN', roles: ['健康保健中心'], icon: 'list', noCache: true },
    children: [
      {
        path: 'PatientListHN',
        component: () => import('HNDC/Patientlist/Patientlist.vue'),
        name: 'PatientListHN',
        meta: { title: 'PatientListHN', icon: 'list', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
  {
    path: '/AbnormalStatisticHN',
    component: Layout,
    meta: { title: 'AbnormalStatisticHN', roles: ['健康保健中心'], icon: 'bug', noCache: true },
    children: [
      {
        path: 'AbnormalStatisticHN',
        component: () => import('HNDC/AbnormalStatistic/AbnormalStatistic.vue'),
        name: 'AbnormalStatisticHN',
        meta: { title: 'AbnormalStatisticHN', icon: 'bug', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
  {
    path: '/MySurveyHN',
    component: Layout,
    meta: { title: 'MySurveyHN', roles: ['健康保健中心'], icon: 'form', noCache: true },
    children: [
      {
        path: 'zySurveyPlanHN',
        component: () => import('HNDC/MySurvey/zySurveyPlan.vue'),
        name: 'zySurveyPlanHN',
        meta: { title: 'zySurveyPlanHN', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'mzSurveyPlanHN',
        component: () => import('HNDC/MySurvey/mzSurveyPlan.vue'),
        name: 'mzSurveyPlanHN',
        meta: { title: 'mzSurveyPlanHN', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'zySurveyResultHN',
        component: () => import('HNDC/MySurvey/zySurveyResult.vue'),
        name: 'zySurveyResultHN',
        meta: { title: 'zySurveyResultHN', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'mzSurveyResultHN',
        component: () => import('HNDC/MySurvey/mzSurveyResult.vue'),
        name: 'mzSurveyResultHN',
        meta: { title: 'mzSurveyResultHN', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'statisticalDataHN',
        component: () => import('HNDC/MySurvey/statisticalData.vue'),
        name: 'statisticalDataHN',
        meta: { title: 'statisticalDataHN', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
];
