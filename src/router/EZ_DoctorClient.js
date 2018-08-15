
import Layout from '@/views/layout/Layout';

const roles = ['台州恩泽医院']; // 首页

// todo roles的值待改，权限控制
export const EZ_DoctorClient = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    meta: { title: '', roles: roles, icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'Home',
        component: () => import('HNDC/Homepage/Index.vue'),
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
  }
];
