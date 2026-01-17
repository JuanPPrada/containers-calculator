import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'transformers',
        component: () => import('src/views/Transformers/TransformersList.vue'),
      },
      {
        path: 'transformers/create',
        component: () => import('src/views/Transformers/TransformerForm.vue'),
      },
      {
        path: 'transformers/:id/edit',
        component: () => import('src/views/Transformers/TransformerForm.vue'),
      },
      {
        path: 'containers',
        component: () => import('src/views/Containers/ContainersList.vue'),
      },
      {
        path: 'containers/create',
        component: () => import('src/views/Containers/ContainerForm.vue'),
      },
      {
        path: 'containers/:id/edit',
        component: () => import('src/views/Containers/ContainerForm.vue'),
      },

      // ĞY'Î NUEVA RUTA PARA PROBAR PINIA
      {
        path: 'ejemplo/pinia',
        component: () => import('src/views/Ejemplo/PiniaExample.vue'),
      },
    ],
  },

  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
