import Main from '@/views/Main.vue';


// 不作为Main组件的子页面展示的页面单独写，如下

export const page404 = {
  path: '/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component:resolve => void(require(['@/views/error-page/404.vue'],resolve)),// 懒加载 () => import('@/views/error-page/404.vue')
};

export const page403 = {
  path: '/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component:resolve => void(require(['@/views/error-page/403.vue'],resolve)),// 懒加载 () => import('@//views/error-page/403.vue')
};

export const page500 = {
  path: '/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component:resolve => void(require(['@/views/error-page/500.vue'],resolve)),// 懒加载 () => import('@/views/error-page/500.vue')
};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const appRouter = {
  path: '/',
  name: 'home',
  redirect: '/home',
  component: Main,
  children: [
    { path: '/home',
      title: '主页',
      name: 'home',
      meta: {
        keepAlive: true, // 需要被缓存
        needVip:false
      },
      component: resolve => void(require(['@/views/home/home.vue'],resolve)),},
    { path: '/common-subjects',
      title: '练习题',
      name: 'common-subjects',
      meta: {
        keepAlive: true,
        needVip:true,
      },
      component: resolve => void(require(['@/views/common-subjects/common-subjects.vue'],resolve)),},
    { path: '/free-questions',
      title: '免费试学',
      name: 'free-questions',
      meta: {
        keepAlive: false,
        needVip:false,
      },
      component: resolve => void(require(['@/views/free-questions/free-questions.vue'],resolve)),},
    { path: '/mock-exam',
      title: '模拟考试',
      name: 'mock-exam',
      meta: {
        keepAlive: false,
        needVip:true,
      },
      component: resolve => void(require(['@/views/mock-exam/mock-exam.vue'],resolve)),},
    { path: '/photo-basic-skills',
      title: '图片基础知识',
      name: 'photo-basic-skills',
      meta: {
        keepAlive: true,
        needVip:true,
      },
      component: resolve => void(require(['@/views/photo-basic-skills/photo-basic-skills.vue'],resolve)),}
  ]
};


// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  appRouter,
  page500,
  page403,
  page404
];
