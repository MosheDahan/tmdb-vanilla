import { router } from './router.js';

window.addEventListener('DOMContentLoaded', () => {
  console.log('[app] loaded');
  router();
  window.addEventListener('hashchange', router);
});
