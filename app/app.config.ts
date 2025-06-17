import { navigationConfig } from './config/navigation';
import { dashboardUserMenuConfig } from './config/dashboardUserMenu';
import { faqConfig } from './config/faq';
import type { Billing } from '~~/types/billing';
import type { SocialLink } from '@/components/marketing/WhoAmI.vue';

export default defineAppConfig({
  general: {
    contactEmail: 'test@mail.com',
    name: 'SaaS App',
  },
  billing: {
    billingProvider: 'lemonsqueezy',
    allowUnauthenticated: true,
    customerPortalUrl: '/',
    isSubscription: true,
    featuredBadgeText: 'Most popular',
    yearSavings: 25,
    plans: [
      {
        productId: '383971',
        paymentLink: {
          monthly: '/',
          yearly: '/',
          oneTime: '/',
        },
        name: 'Starter',
        priceMonth: 10,
        priceYear: 100,
        description: 'Get started with basic plan',
        features: [
          'Access to basic components',
          'Unlimited projects',
          'Custom domain',
          '24/7 support',
        ],
        notAvailableFeatures: [
          'Advanced analytics',
          'Premium components',
        ],
        buttonText: 'Get started',
        buttonVariant: 'outline',
        isFeatured: false,
      },
      {
        productId: '386264',
        paymentLink: {
          monthly: '/',
          yearly: '/',
          oneTime: '/',
        },
        name: 'Pro',
        priceMonth: 60,
        priceYear: 600,
        description: 'Get started with pro plan',
        features: [
          'Access to advanced components',
          'Unlimited projects',
          'Custom domain',
          '24/7 support',
          'Advanced analytics',
        ],
        notAvailableFeatures: [
          'Premium components',
        ],
        buttonText: 'Get started',
        buttonVariant: 'default',
        isFeatured: true,
      },
      {
        productId: '581663',
        paymentLink: {
          monthly: '/',
          yearly: '/',
          oneTime: '/',
        },
        name: 'Enterprise',
        priceMonth: 100,
        priceYear: 1000,
        description: 'Get started with enterprise plan',
        features: [
          'Access to all components',
          'Unlimited projects',
          'Custom domain',
          '24/7 support',
          'Advanced analytics',
          'Dedicated account manager',
        ],
        notAvailableFeatures: [],
        buttonText: 'Get started',
        buttonVariant: 'outline',
        isFeatured: false,
      },
    ],
  } as Billing,
  navigation: navigationConfig,
  dashboardUserMenu: dashboardUserMenuConfig,
  faq: faqConfig,
  socialLinks: [
    {
      platform: 'x',
      url: 'https://x.com/stvladyslav',
      icon: 'simple-icons:x',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/stvladyslav',
      icon: 'simple-icons:linkedin',
    },
    {
      platform: 'github',
      url: 'https://github.com/stvladyslav',
      icon: 'simple-icons:github',
    },
  ] as SocialLink[],
});
