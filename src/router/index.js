import Vue from 'vue'
import Router from 'vue-router'
import TestMap from '@/components/TestMap'
import Home from '@/components/Home'
import Chart from '../components/chart.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TestMap',
      component: TestMap
    },
    {
      path: '/Home',
      name: 'Home',
      component: Home
    },
    {
      path: '/Chart',
      name: 'Chart',
      component: Chart
    }
  ]
})
