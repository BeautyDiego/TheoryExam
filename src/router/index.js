// import { routers } from './router'
//
// // 路由配置
// const RouterConfig = {
//   // mode: 'history',
//   routes: routers
// }
//
// export const router = new VueRouter(RouterConfig)

import { routers } from './router'
import Vue from 'vue'
// import Router from 'vue-router'
import {LoadingBar,Message} from 'iview'
import { getToken,getVipAuth } from '@/libs/util'

const router = new VueRouter({
  routes: routers
})
const HOME_PAGE_NAME = 'home'

router.beforeEach((to, from, next) => {

  LoadingBar.start()
  const token = getToken();
  const isVip = getVipAuth()==="true";
  if (to.meta.needVip){
    if (token&&isVip){
      next() // 跳转
    }else if (token&&!isVip){
      Message.error("您的Vip时间已过期，请联系管理员！");
      next({
        name: HOME_PAGE_NAME // 跳转到登录页
      })
    }else{
      Message.error("该页面需要VIP权限，请先登录！");
      next({
        name: HOME_PAGE_NAME // 跳转到登录页
      })
    }
  }else{
    next() // 跳转
  }
})

router.afterEach(to => {
  LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
