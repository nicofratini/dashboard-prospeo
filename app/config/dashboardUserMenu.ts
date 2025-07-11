export const dashboardUserMenuConfig = {
  enableIcons: true,
  links: [
    {
      title: 'Account',
      to: '/dashboard/settings/general',
      icon: 'line-md:account',
      shortcut: '⇧⌘A',
    },
    {
      title: 'Team',
      to: '/dashboard/settings/team',
      icon: 'mdi:users-group',
      shortcut: '⇧⌘T',
    },
    {
      title: 'Billing',
      to: '/dashboard/settings/billing',
      icon: 'mdi:credit-card',
      shortcut: '⇧⌘B',
    },
    {
      title: 'Notifications',
      to: '/dashboard/settings/general',
      icon: 'mdi:push-notification-outline',
      shortcut: '⇧⌘N',
    },
  ],
};
