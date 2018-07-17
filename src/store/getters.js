const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  // 用户权限
  roles: state => state.user.roles,
  permission_routers: state => state.permission.routers,
  // 动态新增的路由
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
};
export default getters;
