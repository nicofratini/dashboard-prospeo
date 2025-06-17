import type { ContentNavigationItem } from '@nuxt/content';

export function flattenNavigation(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return items.reduce((acc: ContentNavigationItem[], item) => {
    acc.push(item);
    if (item.children?.length) {
      acc.push(...flattenNavigation(item.children));
    }
    return acc;
  }, []);
}
