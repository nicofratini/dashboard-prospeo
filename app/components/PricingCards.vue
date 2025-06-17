<script setup lang="ts">
type ButtonVariant = 'link' | 'outline' | 'default' | 'secondary' | 'destructive' | 'ghost';
const { billing: {
  billingProvider,
  allowUnauthenticated,
  isSubscription,
  featuredBadgeText,
  yearSavings,
  plans,
} } = useAppConfig();
const user = useSupabaseUser();

withDefaults(defineProps<{
  title?: string;
  description?: string;
}>(), {
  title: 'Choose the Perfect Plan for Your Needs',
  description: 'Choose from flexible pricing tiers designed to scale with your project, from startups to enterprise solutions.',
});

const featuredCardClass: string = 'lg:scale-110 border-2 border-primary max-w-sm relative';

const isYearly = ref(true);

const allowedVariants: ButtonVariant[] = ['link', 'outline', 'default', 'secondary', 'destructive', 'ghost'];

const getButtonVariant = (variant: string | null | undefined): ButtonVariant | null | undefined => {
  return allowedVariants.includes(variant as ButtonVariant) ? variant as ButtonVariant : 'default';
};

const handleButtonClick = async (link: string) => {
  if (!user.value) {
    const redirectUrl = allowUnauthenticated ? link : `/sign-in?redirect=${link}`;
    return navigateTo(redirectUrl, { external: allowUnauthenticated });
  }

  const email = encodeURIComponent(user.value.email as string);

  const redirectUrl = billingProvider === 'stripe' ? `${link}?prefilled_email=${email}` : `${link}?checkout[email]=${email}`;

  return navigateTo(redirectUrl, { external: true });
};
</script>

<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <h2 class="text-4xl font-bold mb-4">
        {{ title }}
      </h2>
      <p class="text-lg text-muted-foreground mb-8">
        {{ description }}
      </p>
      <div
        v-if="isSubscription"
        class="flex justify-center items-center space-x-2 text-lg relative"
      >
        <span class="text-lg">Monthly</span>

        <Switch
          id="subscription-mode"
          :model-value="isYearly"
          default-checked
          @update:model-value="() => {
            isYearly = !isYearly;
          }"
        />

        <span class="text-lg">
          Yearly
        </span>
        <span
          v-if="yearSavings"
          class="text-emerald-700 text-md absolute left-full whitespace-nowrap"
        >Save {{
          yearSavings
        }}%</span>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row items-center justify-center gap-2 my-12 lg:my-20">
      <Card
        v-for="(plan, i) in plans"
        :key="i"
        class="max-w-sm min-h-[500px]"
        :class="plan.isFeatured ? featuredCardClass : ''"
      >
        <div
          v-if="plan.isFeatured"
          class="absolute inset-x-0 text-center -top-4"
        >
          <Badge class="hover:bg-primary cursor-default">
            {{ featuredBadgeText }}
          </Badge>
        </div>
        <div class="mx-12 mt-12 font-bold">
          {{ plan.name }}
        </div>
        <CardHeader class="pt-2 px-12">
          <CardTitle class="text-3xl flex flex-row items-end">
            <span class="font-semibold">
              $<NumberTicker
                :duration="500"
                :value="isYearly ? plan.priceYear : plan.priceMonth"
              />
            </span>
            <span
              v-if="isSubscription"
              class="text-sm/6 text-muted-foreground ml-0.5"
            >/ {{ isYearly ? 'year' : 'month' }}
            </span>
          </CardTitle>
          <CardDescription>{{ plan.description }}</CardDescription>
        </CardHeader>
        <CardContent class="flex justify-center px-12">
          <!-- [TIP] A sample of redirecting to the billing provider -->
          <!--  <Button
            :variant="getButtonVariant(plan.buttonVariant)"
            class="w-full"
            @click="handleButtonClick(isSubscription ? (isYearly ? plan.paymentLink.yearly : plan.paymentLink.monthly) : plan.paymentLink.oneTime)"
          >
            {{ plan.buttonText }}
          </Button> -->

          <Button
            as-child
            class="w-full"
          >
            <NuxtLink to="/dashboard">
              {{ plan.buttonText }}
            </NuxtLink>
          </Button>
        </CardContent>
        <CardFooter class="px-12">
          <div class="flex flex-col justify-center items-start space-y-2 text-sm/6">
            <h3 class="font-medium">
              {{ plan.featuresTitle ?? 'Start selling with' }}
            </h3>
            <div
              v-for="(feature, featureIndex) in plan.features"
              :key="featureIndex"
              class="flex flex-row justify-center items-center space-x-2"
            >
              <Icon
                name="mdi:check"
                class="text-accent-foreground"
              />
              <span>{{ feature }}</span>
            </div>
            <div
              v-for="(notAvailableFeature, notAvailableFeatureIndex) in plan.notAvailableFeatures"
              :key="notAvailableFeatureIndex"
              class="flex flex-row justify-center items-center space-x-2"
            >
              <Icon
                name="mdi:close"
                class="text-red-500"
              />
              <span>{{ notAvailableFeature }}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
      <!--      <Card class="lg:scale-110 border-2 border-accent-foreground max-w-sm">
              <div class="absolute inset-x-0 text-center -top-4">
                <Badge class="hover:bg-primary cursor-default">Most popular</Badge>
              </div>
              <div class="mx-12 mt-12 font-bold">Basic</div>
              <CardHeader class="pt-2 px-12">
                <CardTitle class="font-bold text-3xl">$30/mo</CardTitle>
                <CardDescription>Perfect for small teams and businesses</CardDescription>
              </CardHeader>
              <CardContent class="flex justify-center px-12">
                <Button class="w-full">Get Started</Button>
              </CardContent>
              <CardFooter class="px-12">
                <div class="flex flex-col justify-center items-start space-y-2">
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">All components:</span> Access to all advanced components</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">Unlimited projects:</span> Create as many projects as you want</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">Custom domain:</span> Use your own domain name</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">24/7 support:</span> Get help anytime you need it</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">Advanced analytics:</span> Detailed insights and reports</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            <Card class="max-w-sm">
              <div class="mx-12 mt-12 font-bold">Pro</div>
              <CardHeader class="pt-2 px-12">
                <CardTitle class="font-bold text-3xl">$50/mo</CardTitle>
                <CardDescription>Best for large organizations</CardDescription>
              </CardHeader>
              <CardContent class="flex justify-center px-12">
                <Button variant="outline" class="w-full">Get Started</Button>
              </CardContent>
              <CardFooter class="px-12">
                <div class="flex flex-col justify-center items-start space-y-2">
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">All components:</span> Access to all premium components</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">Unlimited projects:</span> Create as many projects as you want</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">Custom domain:</span> Use your own domain name</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">24/7 support:</span> Get help anytime you need it</span>
                  </div>
                  <div class="flex flex-row justify-center items-center space-x-2">
                    <Icon name="mdi:check" class="text-green-500"/>
                    <span><span class="font-bold">Advanced analytics:</span> Detailed insights and reports</span>
                  </div>
                </div>
              </CardFooter>
            </Card> -->
    </div>
  </div>
</template>
