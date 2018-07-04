
import Layout from '@/views/layout/Layout';

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
        meta: { title: 'Home', icon: 'dashboard', roles: ['健康保健中心'], noCache: true }
      }
    ]
  },
  {
    path: '/PhysicalExaminationNotice',
    component: Layout,
    meta: { title: 'PhysicalExaminationNotice', roles: ['健康保健中心'], icon: 'icon', noCache: true },
    children: [
      {
        path: 'InitiateNotification',
        component: () => import('RJPE/InitiateNotification.vue'),
        name: 'InitiateNotification',
        meta: { title: 'InitiateNotification', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'NoticePlan',
        component: () => import('RJPE/NoticePlan.vue'),
        name: 'NoticePlan',
        meta: { title: 'NoticePlan', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'NoticeResult',
        component: () => import('RJPE/NoticeResult.vue'),
        name: 'NoticeResult',
        meta: { title: 'NoticeResult', roles: ['健康保健中心'], noCache: true }
      },
      {
        path: 'Statistics',
        component: () => import('RJPE/Statistics.vue'),
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
        component: () => import('RJPE/PatientList.vue'),
        name: 'PatientList',
        meta: { title: 'PatientList', icon: 'list', roles: ['健康保健中心'], noCache: true }
      }
    ]
  }

];
