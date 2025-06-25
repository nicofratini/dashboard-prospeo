import { navigationConfig } from './config/navigation';
import { dashboardUserMenuConfig } from './config/dashboardUserMenu';
import { faqConfig } from './config/faq';
import type { Billing } from '~~/types/billing';
import type { SocialLink } from '@/components/marketing/WhoAmI.vue';

export default defineAppConfig({
  general: {
    contactEmail: 'contact@info.prospeo.ai',
    name: 'Prospeo.ai',
  },
  billing: {
    billingProvider: 'stripe',
    allowUnauthenticated: false,
    customerPortalUrl: 'https://billing.stripe.com/p/login/test_9B628qauifk6aNc5up2Ji00',
    isSubscription: true,
    featuredBadgeText: 'Most popular',
    yearSavings: 25,
    plans: [
      {
        productId: 'prod_SW4fmTJtMa7wWh',
        paymentLink: {
          monthly: 'https://buy.stripe.com/test_14AbJ0dGu8VI5sS6yt2Ji05',
          yearly: 'https://buy.stripe.com/test_6oUcN41XM6NA5sS9KF2Ji04',
        },
        name: 'Discovery',
        priceMonth: 149,
        priceYear: 119,
        description: 'Get started with basic plan',
        minutesIncluded: 280,
        features: [
          '280 (~70 calls) Minutes Included per Month',
          'Integrated Unified Calendar',
          'Appointment Scheduling',
          '2 languages',
          'Female or Male voice',
        ],
        notAvailableFeatures: [
          'Dashboard analytics',
          'Connect your CRM',
          'Team management',
        ],
        buttonText: 'Get started',
        buttonVariant: 'outline',
        isFeatured: false,
      },
      {
        productId: 'prod_SYhLke8jFdkmIc',
        paymentLink: {
          monthly: 'https://buy.stripe.com/test_8x214m1XM1tgcVkg932Ji07',
          yearly: 'https://buy.stripe.com/test_28EfZg1XMb3Q9J87Cx2Ji06',
        },
        name: 'Growth',
        priceMonth: 249,
        priceYear: 199,
        description: '',
        featuresTitle: 'Everything in Discovery, plus :',
        minutesIncluded: 600,
        features: [
          '600 (~150 calls) Minutes Included per Month',
          'Dashboard analytics',
          'Connect your CRM',
          'Data Export',
          'Team management',
          '4 languages',
          'Choose between 5 voices',
        ],
        buttonText: 'Get started',
        buttonVariant: 'default',
        isFeatured: true,
      },
      {
        productId: 'prod_SYhMcrcLUGuoHO',
        paymentLink: {
          monthly: 'https://buy.stripe.com/test_bJe3cu31Q7RE6wW5up2Ji03',
          yearly: 'https://buy.stripe.com/test_5kQeVccCq5Jw8F4bSN2Ji02',
        },
        name: 'Pro',
        priceMonth: 399,
        priceYear: 319,
        description: '',
        featuresTitle: 'Everything in Growth, plus :',
        minutesIncluded: 1400,
        features: [
          '1400 Minutes Included per Month (~350 calls)',
        ],
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
      url: 'https://x.com/prospeo.ai',
      icon: 'simple-icons:x',
    },
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/in/prospeo.ai',
      icon: 'simple-icons:linkedin',
    },
    {
      platform: 'github',
      url: 'https://github.com/prospeo.ai',
      icon: 'simple-icons:github',
    },
  ] as SocialLink[],
});
