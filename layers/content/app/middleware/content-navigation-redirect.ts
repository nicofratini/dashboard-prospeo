/**
 * Middleware to handle navigation redirects based on the content of the page.
 *
 * @param {Object} to - The target route object.
 * @returns {Promise<void>} - A promise that resolves when the middleware is complete.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.prerender) return;

  const { data: navigation } = await useAsyncData('navigation-docs-flat', () => queryCollectionNavigation('docs', ['path', 'redirect']), {
    server: true,
    transform: nav => flattenNavigation(nav),
  });

  if (!navigation.value) return;

  // Find the current page in navigation
  const currentPage = navigation.value.find(item => item.path === to.path);

  if (currentPage?.redirect) {
    return navigateTo(currentPage.redirect);
  }
});
