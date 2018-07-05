/**
 * @description 仁济体检中心路由
 */
import Layout from '@/views/layout/Layout';

const roles = roles;

export const RJ_PhysicalExamination = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    children: [
      {
        path: 'Home',
        component: () => import('RJPE/home.vue'),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', roles: roles, noCache: true }
      }
    ]
  },
  {
    path: '/PhysicalExaminationNotice',
    component: Layout,
    meta: { title: 'PhysicalExaminationNotice', roles: roles, icon: 'icon', noCache: true },
    children: [
      {
        path: 'InitiateNotification',
        component: () => import('RJPE/InitiateNotification.vue'),
        name: 'InitiateNotification',
        meta: { title: 'InitiateNotification', roles: roles, noCache: true }
      },
      {
        path: 'NoticePlan',
        component: () => import('RJPE/NoticePlan.vue'),
        name: 'NoticePlan',
        meta: { title: 'NoticePlan', roles: roles, noCache: true }
      },
      {
        path: 'NoticeResult',
        component: () => import('RJPE/NoticeResult.vue'),
        name: 'NoticeResult',
        meta: { title: 'NoticeResult', roles: roles, noCache: true }
      }
      // {
      //   path: 'Statistics',
      //   component: () => import('RJPE/Statistics.vue'),
      //   name: 'Statistics',
      //   meta: { title: 'Statistics', roles: roles, noCache: true }
      // }
    ]
  },
  {
    path: '/Patient',
    component: Layout,
    meta: { title: 'Patient', roles: roles, icon: 'list', noCache: true },
    children: [
      {
        path: 'PatientList',
        component: () => import('RJPE/PatientList.vue'),
        name: 'PatientList',
        meta: { title: 'PatientList', icon: 'list', roles: roles, noCache: true }
      }
    ]
  }
];
