
import Layout from '@/views/layout/Layout';

const roles = ['昆明金碧社区医院'];

export const KMJB_DoctorClient = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    meta: { title: '', roles: roles, icon: 'dashboard', noCache: true },
    children: [
      {
        path: 'Home',
        component: () => import('KMJB/Homepage/Index.vue'),
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
        component: () => import('KMJB/FollowPlan/FollowPlan.vue'),
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
        component: () => import('KMJB/FollowRecord/FollowRecord.vue'),
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
        component: () => import('KMJB/Patientlist/Patientlist.vue'),
        name: 'PatientList',
        meta: { title: 'PatientList', icon: 'list', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/DataAddUp',
    component: Layout,
    meta: { title: 'DataAddUp', roles: roles, icon: 'form', noCache: true },
    children: [
      {
        path: 'MessageStatistics',
        component: () => import('KMJB/DataAddUp/MessageStatistics.vue'),
        name: 'MessageStatistics',
        meta: { title: 'MessageStatistics', roles: roles, noCache: true }
      },
      {
        path: 'ReturnVisit',
        component: () => import('KMJB/DataAddUp/ReturnVisit.vue'),
        name: 'ReturnVisit',
        meta: { title: 'ReturnVisit', roles: roles, noCache: true }
      }
    ]
  }
];
