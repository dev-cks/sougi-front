import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/view/Home'
import Company from '@/view/Company'
import Complete from '@/view/Complete'
import Condolence from '@/view/Condolence'
import EditProfile from '@/view/EditProfile'
import Incense from '@/view/Incense'
import Inquiry from '@/view/Inquiry'
import InquirySend from '@/view/InquirySend'
import Line from '@/view/Line'
import Login from '@/view/Login'
import Notation from '@/view/Notation'
import Privacy from '@/view/Privacy'
import Profile from '@/view/Profile'
import Register from '@/view/Register'
import RegisterConfirm from '@/view/RegisterConfirm'
import Terms from '@/view/Terms'
import NotFound from '@/view/NotFound';
import LiveLogin from '@/view/Live/Login';
import LiveManage from '@/view/Live/Manage';
import LiveCamera from '@/view/Live/Camera';
import LiveClient from '@/view/Live/Client';
Vue.use(Router)

export default new Router({

  routes: [
    {
      path: '/main',
      name: 'Home',
      component: Home,
    },
    {
      path: '/user-info/',
      component: Profile
    },
    {
      path: '/inquiry',
      component: Inquiry
    },
    {
      path: '/inquiry/:type',
      component: InquirySend
    },
    {
      path: '/company/:id',
      component: Company
    },
    {
      path: '/pol',
      component: Privacy
    },
    {
      path: '/kiyaku',
      component: Terms
    },
    {
      path: '/line',
      component: Line
    },
    {
      path: '/toku',
      component: Notation
    },
    {
      path: '/notknowother/:id',
      component: EditProfile
    },
    {
      path: '/login/:id',
      component: Login
    },
    {
      path: '/bkeeping-pre/:id',
      component: Register
    },
    {
      path: '/bkeeping/:id',
      component: RegisterConfirm
    },
    {
      path: '/complete/:id',
      component: Complete
    },
    {
      path: '/incense/:id',
      component: Incense
    },
    {
      path: '/teikei',
      component: Condolence
    },
    {
      path: '/live/login',
      component: LiveLogin
    },
    {
      path: '/live/manage',
      component: LiveManage
    },
    {
      path: '/live/camera',
      component: LiveCamera
    },
    {
      path: '/live/stream/:id',
      component: LiveClient
    },
    {
      path: '*',
      component: NotFound
    }
  ]
})
