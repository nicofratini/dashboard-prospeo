export default defineNuxtRouteMiddleware((to, from) => {
  // Check if coming from sign-up page or has email query param
  const isFromSignUp = from.path === '/sign-up';
  const hasEmailParam = !!to.query.email;

  if (!isFromSignUp && !hasEmailParam) {
    // Redirect to sign-up if conditions not met
    return navigateTo('/sign-up');
  }
});
