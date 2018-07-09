/**
 * @description 仁济肿瘤科
 */
import Layout from '@/views/layout/Layout';

const roles = ['上海市仁济医院肿瘤科'];

export const RJ_OncologyDepartment = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    children: [
      {
        path: 'Home',
        component: () => import('RJZL/homePage/homePage.vue'),
        name: 'Home',
        meta: { title: 'Home', icon: 'dashboard', roles: roles, noCache: true }
      }
    ]
  },
  // 患者列表
  {
    path: '/hzList',
    component: Layout,
    meta: { title: 'hzList', roles: roles, icon: 'list', noCache: true },
    children: [
      {
        path: 'hzList',
        component: () => import('RJZL/patientList/patientList.vue'),
        name: 'hzList',
        meta: { title: 'hzList', icon: 'list', roles: roles, noCache: true }
      }
    ]
  },
  // 出院随访
  {
    path: '/dischargeFollowupPlanReview',
    component: Layout,
    meta: { title: 'dischargeFollowupPlanReview', roles: roles, icon: 'icon', noCache: true },
    children: [
      {
        path: 'dischargeFollowupPlanReview',
        component: () => import('RJZL/dischargeFollowup/dischargeFollowupPlanReview.vue'),
        name: '/dischargeFollowupPlanReview',
        meta: { title: 'dischargeFollowupPlanReview', roles: roles, noCache: true }
      },
      {
        path: 'dischargeFollowupResults',
        component: () => import('RJZL/dischargeFollowup/dischargeFollowupResults.vue'),
        name: '/dischargeFollowupResults',
        meta: { title: 'dischargeFollowupResults', roles: roles, noCache: true }
      }
    ]
  },
  // 入院通知
  {
    path: '/notificationsOfAdmission',
    component: Layout,
    meta: { title: 'notificationsOfAdmission', roles: roles, icon: 'icon', noCache: true },
    children: [
      {
        path: 'notificationsOfAdmission',
        component: () => import('RJZL/admissionNotice/notificationsOfAdmission.vue'),
        name: '/notificationsOfAdmission',
        meta: { title: 'notificationsOfAdmission', roles: roles, noCache: true }
      },
      {
        path: 'admissionNoticePlan',
        component: () => import('RJZL/admissionNotice/admissionNoticePlan.vue'),
        name: '/admissionNoticePlan',
        meta: { title: 'admissionNoticePlan', roles: roles, noCache: true }
      },
      {
        path: 'admissionNoticeResults',
        component: () => import('RJZL/admissionNotice/admissionNoticeResults.vue'),
        name: '/admissionNoticeResults',
        meta: { title: 'admissionNoticeResults', roles: roles, noCache: true }
      }
    ]
  },
  // 检查通知
  {
    path: '/initiatingNoticeOfInspection',
    component: Layout,
    meta: { title: 'initiatingNoticeOfInspection', roles: roles, icon: 'icon', noCache: true },
    children: [
      {
        path: 'initiatingNoticeOfInspection',
        component: () => import('RJZL/inspectionNotice/initiatingNoticeOfInspection.vue'),
        name: '/initiatingNoticeOfInspection',
        meta: { title: 'initiatingNoticeOfInspection', roles: roles, noCache: true }
      },
      {
        path: 'initiatingNoticePlan',
        component: () => import('RJZL/inspectionNotice/initiatingNoticePlan.vue'),
        name: '/initiatingNoticePlan',
        meta: { title: 'initiatingNoticePlan', roles: roles, noCache: true }
      },
      {
        path: 'checkTheResultOfTheNotice',
        component: () => import('RJZL/inspectionNotice/checkTheResultOfTheNotice.vue'),
        name: '/checkTheResultOfTheNotice',
        meta: { title: 'checkTheResultOfTheNotice', roles: roles, noCache: true }
      }
    ]
  },
];
