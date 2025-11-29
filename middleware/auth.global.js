export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore();
  
  if (to.path === '/favorites' && !userStore.isAuthenticated) {
    return navigateTo('/login');
  }
});