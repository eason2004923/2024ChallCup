import { createRouter, createWebHistory } from 'vue-router'
import Background from '@/views/Background.vue'
import Description from '@/views/Description.vue'
import Diagnosis from '@/views/Diagnosis.vue'
import index from '@/views/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Index',
      component: index
    },
    {
      path: '/background',
      name: 'background',
      component: Background
    },
    {
      path: '/description',
      name: 'description',
      component: Description
    },
    {
      path: '/diagnosis',
      name: 'diagnosis',
      component: Diagnosis
    }
  ]
})

export default router
