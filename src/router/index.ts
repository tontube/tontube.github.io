import { createRouter, createWebHistory } from 'vue-router'
import Mnemonics from '../views/Mnemonics.vue'
import Home from '../views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Mnemonics',
      component: Mnemonics
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
  ]
})

export default router
