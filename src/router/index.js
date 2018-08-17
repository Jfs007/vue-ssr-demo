import Vue from 'vue';
import Router from 'vue-router';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const __import__ = views => resolve => import('views/'+ views);

export default function createRouter() {

  const router = new VueRouter({
    mode: 'history',
    fallback: false,
    routes: [
      { 

        path: '/home',
        name: 'home',
        component: __import__('home.vue')
      },
      {

        path: '/about',
        name: 'about',
        component: __import__('about.vue'),
        redirect: '/about/sub-about',
        children: [
          {
            path: 'sub-about',
            name: 'sub_about',
            component: __import__('subAbout.vue'),
          }
        ]
      },
      {
        path: '*',
        redirect: '/home'
      }
    ] 
  });
  return router;


}