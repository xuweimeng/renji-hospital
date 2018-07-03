
import Layout from '@/views/layout/Layout';

export const LQ_PhysicalExamination = [
  {
    path: '/PhysicalExaminationNotice',
    component: Layout,
    meta: { title: 'PhysicalExaminationNotice', roles: ['健康保健中心'], icon: 'icon', noCache: true },
    children: [
      {
        path: 'InitiateNotification',
        component: () => import('LQPE/InitiateNotification.vue'),
        name: 'InitiateNotification',
        meta: { title: 'InitiateNotification', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'NoticePlan',
        component: () => import('LQPE/NoticePlan.vue'),
        name: 'NoticePlan',
        meta: { title: 'NoticePlan', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'NoticeResult',
        component: () => import('LQPE/NoticeResult.vue'),
        name: 'NoticeResult',
        meta: { title: 'NoticeResult', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'Statistics',
        component: () => import('LQPE/Statistics.vue'),
        name: 'Statistics',
        meta: { title: 'Statistics', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
  {
    path: '/Patient',
    component: Layout,
    meta: { title: 'Patient', roles: ['健康保健中心'], icon: 'list', noCache: true },
    children: [
      {
        path: 'PatientList',
        component: () => import('LQPE/PatientList.vue'),
        name: 'PatientList',
        meta: { title: 'PatientList', icon: 'list', roles: ['健康保健中心'], noCache: true }
      }
    ]
  }
];
