import Vue from 'vue';
import Router from 'vue-router';
// 导入所有项目路由
import { LQ_PhysicalExamination } from './LQ_PhysicalExamination';// 乐清六院
import { HN_DoctorClient } from './HN_DoctorClient';// 海宁医生端
import { RJ_PhysicalExamination } from './RJ_PhysicalExamination';// 仁济体检中心
import { EY_DoctorClient } from './EY_DoctorClient';// 儿研医生端
import { SY_DoctorClient } from './SY_DoctorClient';// 十院医生端
import { RJ_OncologyDepartment } from './RJ_OncologyDepartment';// 仁济肿瘤科
import { EZ_DoctorClient } from './EZ_DoctorClient';// 台州恩泽医院
import { KMJB_DoctorClient } from './KMJB_DoctorClient';// 昆明金碧医生端
Vue.use(Router);

/* Layout布局器文件 */
import Layout from '@/views/layout/Layout';

/**
* hidden: true                   当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
* alwaysShow: true               //当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
                                 //只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
                                 //若你想不管路由下面的 children 声明的个数都显示你的根路由
                                 //你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
* meta : {
    roles: ['admin','editor']    //设置该路由进入的权限，支持多个权限叠加
    title: 'title'               //设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             //设置该路由的图标
    noCache: true                //如果设置为true ,则不会被 <keep-alive> 缓存(默认 false)
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
  ...RJ_PhysicalExamination, // 仁济体检中心
  ...LQ_PhysicalExamination, // 乐清体检中心
  ...RJ_OncologyDepartment, // 仁济肿瘤科
  ...HN_DoctorClient, // 海宁医生端
  ...EY_DoctorClient, // 儿研医生端
  ...SY_DoctorClient, // 十院医生端
  ...EZ_DoctorClient, // 台州恩泽医院
  ...KMJB_DoctorClient, // 昆明金碧
  // ...default_asyncRouterMap
  { path: '*', redirect: '/404', hidden: true }
];
