interface NavigationLink {
  title: string;
  description?: string;
  to?: string;
  icon?: string;
  isMain?: boolean;
  links?: NavigationLink[];
  shortcut?: string;
}

interface UserMenuConfig {
  enableIcons: boolean;
  links: NavigationLink[];
}

interface NavigationConfig {
  enableColorSwitch: boolean;
  links: NavigationLink[];
  userMenu: UserMenuConfig;
}

export const navigationConfig: NavigationConfig = {
  enableColorSwitch: true,
  links: [
    {
      title: 'Getting Started',
      isMain: true,
      links: [
        {
          title: 'Introduction',
          description: 'Re-usable components built using Radix UI and Tailwind CSS.',
          to: '/docs/getting-started',
        },
        {
          title: 'Guides',
          description: 'Follow carefully rafter guides to get your app ready even faster.',
          to: '/docs/guide',
        },
        {
          title: 'Components',
          description: 'Re-usable components built using Radix UI and Tailwind CSS.',
          to: '/docs/components',
        },
      ],
    },
    {
      title: 'Directory',
      links: [
        {
          title: 'Browse Resources',
          description: 'Explore our curated collection of resources and tools.',
          to: '/directory',
          icon: 'mdi:view-grid-outline',
        },
        {
          title: 'Categories',
          description: 'Browse resources by category.',
          to: '/directory/categories',
          icon: 'mdi:folder-multiple-outline',
        },
        {
          title: 'Tags',
          description: 'Discover resources by tags.',
          to: '/directory/tags',
          icon: 'mdi:tag-multiple-outline',
        },
        {
          title: 'Submit Resource',
          description: 'Add your own resource to our directory.',
          to: '/directory/submit',
          icon: 'line-md:plus-circle',
        },
      ],
    },
    {
      title: 'AI',
      links: [
        {
          title: 'AI Chat',
          description: 'Chat with AI',
          to: '/dashboard/chat-ai',
          icon: 'mdi:chat-outline',
        },
        {
          title: 'AI Image Gen',
          description: 'Generate images with AI',
          to: '/dashboard/image-ai',
          icon: 'mdi:image-outline',
        },
      ],
    },
    {
      title: 'Pricing',
      to: '/pricing',
    },
    {
      title: 'Docs',
      to: '/docs',
    },
    {
      title: 'Blog',
      to: '/blog',
    },
    {
      title: 'Changelog',
      to: '/changelog',
    },
    {
      title: 'Suggest feature',
      to: '/suggest-feature',
    },
  ],
  userMenu: {
    enableIcons: true,
    links: [
      {
        title: 'Account',
        to: '/dashboard/settings/general',
        icon: 'line-md:account',
        shortcut: '⇧⌘A',
      },
      {
        title: 'Billing',
        to: '/dashboard/settings/billing',
        icon: 'line-md:file-document',
        shortcut: '⇧⌘B',
      },
      {
        title: 'Dashboard',
        to: '/dashboard',
        icon: 'mdi:view-dashboard-variant-outline',
        shortcut: '⇧⌘D',
      },
      {
        title: 'Directory',
        to: '/directory/dashboard',
        icon: 'mdi:format-list-text',
        shortcut: '⌥⌘D',
      },
    ],
  },
};
