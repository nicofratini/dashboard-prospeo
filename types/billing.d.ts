export interface PaymentLink {
  monthly: string;
  yearly: string;
  oneTime: string;
}

export interface Plan {
  productId: string;
  paymentLink: PaymentLink;
  featuresTitle: string;
  name: string;
  priceMonth: number;
  priceYear: number;
  description: string;
  features: string[];
  notAvailableFeatures: string[];
  buttonText: string;
  buttonVariant: string;
  isFeatured: boolean;
}

export interface Billing {
  customerPortalUrl: string;
  billingProvider: 'lemonsqueezy' | 'stripe';
  allowUnauthenticated: boolean;
  isSubscription: boolean;
  featuredBadgeText: string;
  yearSavings: number;
  plans: Plan[];
}
