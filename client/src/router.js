import Vue from 'vue';
import Router from 'vue-router';
import AuthLayout from '@/layout/AuthLayout';
import AdminDashboardLayout from './layout/coreadmin/AdminDashboardLayout';
import LoginComponent from './views/Login';
import DashboardComponent from './views/Dashboard';
import DatabaseComponent from './views/Database';
import ContestantComponent from './views/Contestant';
import QuestionComponent from './views/Question';
import PlayComponent from './views/Play';

Vue.use(Router);

export default new Router({
  mode: "history",
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/dashboard',
      component: AdminDashboardLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          component: DashboardComponent,
        },
        {
          path: '/database',
          name: 'database',
          component: DatabaseComponent,
        },
        {
          path: '/contestant',
          name: 'contestant',
          component: ContestantComponent,
        },
        {
          path: '/question',
          name: 'question',
          component: QuestionComponent,
        },
        {
          path: '/play',
          name: 'play',
          component: PlayComponent,
        }
      ],
    },
    {
      path: '/',
      redirect: '/login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: LoginComponent,
        },
      ],
    },
  ],
});
