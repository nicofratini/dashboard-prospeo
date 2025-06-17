import type { ContentNavigationItem } from '@nuxt/content';

export function navKeyFromPath(path: string, key: string, tree: ContentNavigationItem[]) {
  let value: any;

  const goDeep = (path: string, tree: ContentNavigationItem[]) => {
    for (const file of tree) {
      if (path !== '/' && file.path === '/') {
        // Ignore root page
        continue;
      }
      if (path?.startsWith(file.path) && file[key]) {
        value = file[key];
      }

      if (file.path === path) {
        return;
      }

      if (file.children) {
        goDeep(path, file.children);
      }
    }
  };

  goDeep(path, tree);

  return value;
}
