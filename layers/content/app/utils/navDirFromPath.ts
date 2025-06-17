import type { ContentNavigationItem } from '@nuxt/content';

export function navDirFromPath(path: string, tree: ContentNavigationItem[]): ContentNavigationItem[] | undefined {
  for (const file of tree) {
    if (file.path === path && !file._id) {
      return file.children;
    }

    if (file.children) {
      const result = navDirFromPath(path, file.children);
      if (result) {
        return result;
      }
    }
  }
};
