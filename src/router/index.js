import Vue from 'vue';
import Router from 'vue-router';
// 导入所有项目路由
import { LQ_PhysicalExamination } from './LQ_PhysicalExamination';// 乐清六院
import { HN_DoctorClient } from './HN_DoctorClient';// 海宁医生端
import { RJ_PhysicalExamination } from './RJ_PhysicalExamination';// 仁济体检中心
import { RJ_OncologyDepartment } from './RJ_OncologyDepartment';// 仁济体检中心
Vue.use(Router);

/* Layout布局器文件 */
import Layout from '@/views/layout/Layout';

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/', redirect: '/Home', hidden: true },
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true }
];

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  ...RJ_PhysicalExamination,
  ...LQ_PhysicalExamination,
  ...RJ_OncologyDepartment,
  // ...RJ_PhysicalExamination,
  ...HN_DoctorClient, // 海宁医生端
  // ...default_asyncRouterMap
  { path: '*', redirect: '/404', hidden: true }
];
