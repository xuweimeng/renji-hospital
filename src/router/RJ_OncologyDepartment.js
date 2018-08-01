/**
 * @description 仁济肿瘤科
 */
import Layout from '@/views/layout/Layout';

export const RJ_OncologyDepartment = [
  {
    path: '',
    component: Layout,
    redirect: 'Home',
    children: [
      {
        path: 'Home',
        component: () => import('RJZL/homepage/homepage.vue'),
        // name: 'Home',
        meta: {
          title: 'Home',
          icon: 'shouye',
          roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
          noCache: true
        }
      }
    ]
  },
  // 患者列表
  {
    path: '',
    component: Layout,
    meta: {
      title: 'hzList',
      roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
      icon: 'list',
      noCache: true
    },
    children: [
      {
        path: 'hzList',
        component: () => import('RJZL/patientList/patientList.vue'),
        name: 'hzList',
        meta: {
          title: 'hzList',
          icon: 'list',
          roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
          noCache: true
        }
      },
      {
        path: '/UploadHz',
        component: () => import('RJZL/patientList/uploadHz.vue'),
        name: 'UploadHz',
        meta: {
          title: 'UploadHz',
          icon: 'list',
          roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
          noCache: true
        },
        hidden: true
      },
      {
        path: '/HalfInfo',
        component: () => import('RJZL/patientList/HalfInfo.vue'),
        name: 'HalfInfo',
        meta: {
          title: 'HalfInfo',
          icon: 'list',
          roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
          noCache: true
        },
        hidden: true
      }
    ]
  },
  // 出院随访
  {
    path: '/dischargeFollowupPlanReview',
    component: Layout,
    meta: {
      title: 'dischargeFollowUp',
      roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
      icon: 'suifang',
      noCache: true
    },
    children: [
      {
        path: 'dischargeFollowupPlanReview',
        component: () => import('RJZL/dischargeFollowup/dischargeFollowupPlanReview.vue'),
        name: '/dischargeFollowupPlanReview',
        meta: {
          title: 'dischargeFollowupPlanReview',
          roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
          noCache: true
        }
      },
      {
        path: 'dischargeFollowupResults',
        component: () => import('RJZL/dischargeFollowup/dischargeFollowupResults.vue'),
        name: '/dischargeFollowupResults',
        meta: {
          title: 'dischargeFollowupResults',
          roles: ['上海市仁济医院肿瘤科', '上海市仁济医院日间手术中心'],
          noCache: true
        }
      }
    ]
  },
  // 入院通知
  {
    path: '/notificationsOfAdmission',
    component: Layout,
    meta: {
      title: 'admissionNotice',
      roles: ['上海市仁济医院肿瘤科'],
      icon: 'tongzhi',
      noCache: true
    },
    children: [

      {
        path: 'admissionNoticePlan',
        component: () => import('RJZL/admissionNotice/admissionNoticePlan.vue'),
        name: '/admissionNoticePlan',
        meta: {
          title: 'admissionNoticePlan',
          roles: ['上海市仁济医院肿瘤科'],
          noCache: true
        }
      },
      {
        path: 'notificationsOfAdmission',
        component: () => import('RJZL/admissionNotice/notificationsOfAdmission.vue'),
        name: '/notificationsOfAdmission',
        meta: {
          title: 'notificationsOfAdmission',
          roles: ['上海市仁济医院肿瘤科'],
          noCache: true
        }
      },
      {
        path: 'admissionNoticeResults',
        component: () => import('RJZL/admissionNotice/admissionNoticeResults.vue'),
        name: '/admissionNoticeResults',
        meta: {
          title: 'admissionNoticeResults',
          roles: ['上海市仁济医院肿瘤科'],
          noCache: true
        }
      }
    ]
  },
  // 检查通知
  {
    path: '/initiatingNoticeOfInspection',
    component: Layout,
    meta: {
      title: 'inspectionNotice',
      roles: ['上海市仁济医院肿瘤科'],
      icon: 'jianchaxiang',
      noCache: true
    },
    children: [
      {
        path: 'initiatingNoticeOfInspection',
        component: () => import('RJZL/inspectionNotice/initiatingNoticeOfInspection.vue'),
        name: '/initiatingNoticeOfInspection',
        meta: {
          title: 'initiatingNoticeOfInspection',
          roles: ['上海市仁济医院肿瘤科'],
          noCache: true
        }
      },
      {
        path: 'initiatingNoticePlan',
        component: () => import('RJZL/inspectionNotice/initiatingNoticePlan.vue'),
        name: '/initiatingNoticePlan',
        meta: {
          title: 'initiatingNoticePlan',
          roles: ['上海市仁济医院肿瘤科'],
          noCache: true
        }
      },
      {
        path: 'checkTheResultOfTheNotice',
        component: () => import('RJZL/inspectionNotice/checkTheResultOfTheNotice.vue'),
        name: '/checkTheResultOfTheNotice',
        meta: {
          title: 'checkTheResultOfTheNotice',
          roles: ['上海市仁济医院肿瘤科'],
          noCache: true
        }
      }
    ]
  }
];
