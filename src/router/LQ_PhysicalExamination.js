/**
 * @description 乐清六院路由
 */
import Layout from '@/views/layout/Layout';

// const roles = ['乐清六院'];
const roles = roles;

export const LQ_PhysicalExamination = [
  {
    path: '/PhysicalExaminationNotice',
    component: Layout,
    meta: { title: 'PhysicalExaminationNotice', roles: roles, icon: 'icon', noCache: true },
    children: [
      {
        path: 'InitiateNotification',
        component: () => import('LQPE/InitiateNotification.vue'),
        name: 'InitiateNotification',
        meta: { title: 'InitiateNotification', roles: roles, noCache: true }
      },
      {
        path: 'NoticePlan',
        component: () => import('LQPE/NoticePlan.vue'),
        name: 'NoticePlan',
        meta: { title: 'NoticePlan', roles: roles, noCache: true }
      },
      {
        path: 'NoticeResult',
        component: () => import('LQPE/NoticeResult.vue'),
        name: 'NoticeResult',
        meta: { title: 'NoticeResult', roles: roles, noCache: true }
      },
      {
        path: 'Statistics',
        component: () => import('LQPE/Statistics.vue'),
        name: 'Statistics',
        meta: { title: 'Statistics', roles: roles, noCache: true }
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
        component: () => import('LQPE/PatientList.vue'),
        name: 'PatientList',
        meta: { title: 'PatientList', icon: 'list', roles: roles, noCache: true }
      }
    ]
  }
];
