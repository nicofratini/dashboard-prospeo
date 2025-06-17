<script setup lang="ts">
import type { TestimonialProps } from '~/components/marketing/testimonials/Testimonial.vue';

definePageMeta({
  layout: 'landing',
});

useSeoMeta({
  title: 'Home',
});

const saasFeaturesList = [
  {
    title: 'Authentication',
    description: 'Secure user management',
    content: 'Built-in authentication with email verification, social logins, and role-based access control.',
    alignItemsCenter: true,
    iconName: 'mdi:shield-lock-outline',
  },
  {
    title: 'One-Time Passwords',
    description: 'Enhanced security',
    content: 'Support for OTP authentication with Supabase Auth for secure two-factor verification and account protection.',
    alignItemsCenter: true,
    iconName: 'mdi:cellphone-message',
  },
  {
    title: 'Payments',
    description: 'Stripe integration',
    content: 'Complete subscription management with Stripe and LemonSqueezy.',
    alignItemsCenter: true,
    iconName: 'mdi:credit-card-outline',
  },
  {
    title: 'Customer Portal',
    description: 'Self-service billing',
    content: 'Let your users manage their subscription and billing details in a dedicated Customer Portal by Stripe or LemonSqueezy.',
    alignItemsCenter: true,
    iconName: 'mdi:account-cog-outline',
  },
  {
    title: 'Components',
    description: 'UI building blocks',
    content: 'Extensive collection of pre-built components using Shadcn Vue for rapid development.',
    alignItemsCenter: true,
    iconName: 'mdi:puzzle-outline',
  },
  {
    title: 'Dark Mode',
    description: 'Theme switching',
    content: 'Built-in dark mode support with smooth transitions and system preference detection.',
    alignItemsCenter: true,
    iconName: 'mdi:theme-light-dark',
  },
  {
    title: 'Documentation',
    description: 'Content management',
    content: 'Built-in documentation system powered by Nuxt Content with YAML frontmatter support and automatic SEO optimization.',
    alignItemsCenter: true,
    iconName: 'mdi:file-document-outline',
  },
  {
    title: 'Mobile Ready',
    description: 'Responsive design',
    content: 'Fully responsive UI designed to work seamlessly across all devices and screen sizes.',
    alignItemsCenter: true,
    iconName: 'mdi:responsive',
  },
];

const testimonials: TestimonialProps[] = [
  {
    avatar: '/avatar.svg',
    name: 'Sarah Johnson',
    details: 'CEO at TechCorp',
    description: 'This solution has transformed how I handle our business operations. The efficiency gains have been remarkable, and the support team is incredibly responsive.',
    size: 'lg',
    shape: 'circle',
  },
  {
    avatar: '/avatar.svg',
    name: 'Michael Chen',
    details: 'CTO at StartupX',
    description: 'We\'ve tried many solutions, but this one stands out. The integration was seamless, and our team adapted to it quickly. Highly recommended for any tech company.',
    size: 'lg',
  },
  {
    avatar: '/avatar.svg',
    name: 'Emily Rodriguez',
    details: 'Product Manager',
    description: 'The attention to detail in this product is impressive. It\'s clear that the team understands what businesses need. Our productivity has increased significantly.',
    size: 'lg',
  },
];

const bentoGridItems = [
  {
    name: 'Save your files',
    description: 'We automatically save your files as you type.',
    href: '/',
    image:
      'https://images.pexels.com/photos/2762083/pexels-photo-2762083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    cta: 'Learn more',
    class: 'lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3',
  },
  {
    name: 'Full text search',
    description: 'Search through all your files in one place.',
    href: '/',
    image:
      'https://images.pexels.com/photos/1309766/pexels-photo-1309766.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    cta: 'Learn more',
    class: 'lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3',
  },
  {
    name: 'Multilingual',
    description: 'Supports 100+ languages and counting.',
    href: '/',
    cta: 'Learn more',
    class: 'lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4',
  },
  {
    name: 'Calendar',
    description: 'Use the calendar to filter your files by date.',
    href: '/',
    cta: 'Learn more',
    class: 'lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2',
  },
  {
    name: 'Notifications',
    description: 'Get notified when someone shares a file or mentions you in a comment.',
    href: '/',
    image:
      'https://images.pexels.com/photos/1682821/pexels-photo-1682821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    cta: 'Learn more',
    class: 'lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4',
  },
];

const storyLineItems = [
  {
    icon: 'mdi:currency-usd',
    title: 'Plan your spendings',
    description: 'Excellent budget planning tool',
    badge: 'Some Badge',
    imgSrc: '/plan-spendings-card.svg',
    list: ['Budget planning', 'Expense tracking', 'Saving strategies'],
  },
  {
    icon: 'mdi:clock-time-ten-outline',
    title: 'Track your expenses',
    description: 'Detailed expense tracking',
    badge: 'Some Badge',
    imgSrc: '/plan-spendings-card.svg',
    list: ['Budget planning', 'Expense tracking', 'Saving strategies'],
  },
  {
    icon: 'mdi:information-outline',
    title: 'General improvements',
    description: 'Added some fixes',
    imgSrc: '/plan-spendings-card.svg',
    badge: 'v1.0.0',
    list: ['Fixed some bugs', 'Improved performance', 'Added new features'],
  },
];

const reviews = [
  {
    name: 'Alex Chen',
    username: '@alexdev',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    img: '/avatar.svg',
  },
  {
    name: 'Maria Rodriguez',
    username: '@mariacode',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    img: '/avatar.svg',
  },
  {
    name: 'Raj Patel',
    username: '@rajp',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    img: '/avatar.svg',
  },
  {
    name: 'Sophie Zhang',
    username: '@sophiez',
    body: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    img: '/avatar.svg',
  },
  {
    name: 'Marcus Silva',
    username: '@msilva',
    body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
    img: '/avatar.svg',
  },
  {
    name: 'Aisha Khan',
    username: '@aishak',
    body: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.',
    img: '/avatar.svg',
  },
];
const { title: faqTitle, description: faqDescription, items: faqItems } = useAppConfig().faq;
</script>

<template>
  <div class="flex flex-col w-full gap-6 md:gap-20">
    <section class="md:my-16">
      <HeroCard
        :badge="{
          text: 'Version 1.0.0 is now available!',
          icon: 'line-md:star-alt-filled',
        }"
      >
        <template #title>
          Create your projects in days,
          not
          <FlipWords
            :words="['Weeks', 'Months', 'Years']"
            :duration="3000"
            class="font-accent min-w-60 text-center md:text-start"
          />
        </template>
        <template #description>
          Focus on your idea instantly and let
          <span
            class="bg-gradient-to-r font-brand from-violet-600 via-blue-300 to-emerald-300 bg-clip-text text-transparent text-xl font-bold"
          >
            Nuxtbe
          </span>
          provide all you need to build your SaaS, so you can built profitable business and get your product to market
          in days.
        </template>
        <template #buttons>
          <Button
            as-child
            class="px-16 min-w-80 md:min-w-auto max-w-full"
          >
            <NuxtLink
              to="/dashboard"
              class="flex items-center justify-center group"
            >
              Get Started
              <Icon
                name="mdi:arrow-right"
                size="1.2rem"
                class="transition-transform duration-300 group-hover:translate-x-1"
              />
            </NuxtLink>
          </Button>
          <JoinNewsletterButton />
        </template>
        <template #bottom>
          <UsersRating />
        </template>
      </HeroCard>
    </section>
    <div
      class="hidden md:flex border rounded-2xl border-muted items-center justify-center relative  delay-1000 duration-1000 animate-in fade-in fill-mode-both"
    >
      <ClientOnly>
        <LazyNuxtImg
          v-if="$colorMode.value === 'light'"
          src="/site-screen-light.png"
          class="size-full rounded-2xl"
          alt="Nuxtbe Dashboard Interface"
          preload
        />
        <LazyNuxtImg
          v-else
          src="/site-screen-dark.png"
          class="size-full rounded-2xl"
          alt="Nuxtbe Dashboard Interface"
          preload
        />

        <BorderBeam
          :size="350"
          :border-width="1"
          :duration="12"
          :delay="9"
          class="rounded-2xl"
        />
      </ClientOnly>
    </div>

    <LazyCardList
      hydrate-on-visible
      title="Everything you need to build a SaaS"
      :items="saasFeaturesList"
      :cards-border="false"
      description="From authentication to payments, we've got you covered with all the essential features. Focus on building your unique product while Nuxtbe provides the rest."
    />

    <section>
      <HeroWithIcons>
        <template #title>
          <h2>
            Showcase here yout integrations, tools, technologies, etc
          </h2>
        </template>
      </HeroWithIcons>
    </section>

    <section class="flex items-center justify-center relative flex-col">
      <h2 class="text-4xl font-bold text-center">
        Show here some analytics numbers
      </h2>
      <LazyAdvantagesNumbers
        hydrate-on-visible
        :items="[
          {
            value: '100%',
            label: 'Customizable',
            tooltip: 'Make your SaaS your own. Nuxtbe is built with customization in mind. Every component is modular and can be modified or extended. The codebase follows best practices and is well-documented to make customization straightforward.',
          },
          {
            value: '10-100X',
            label: 'Faster Development',
            tooltip: 'Save hundreds of hours of development time by using our boilerplate. And these numbers are only going to grow with number of projects you will build with Nuxtbe.',
          },
          {
            value: '∞',
            label: 'saved hours',
            tooltip: 'The boilerplates saves you hundreds of hours of development time. Just take a salary of a developer and multiply it by number of hours you will save. The win is undeniable.',
          },
        ]"
      />
    </section>

    <LazyHeroList
      hydrate-on-visible
      :items="[
        {
          badge: 'Modern Tech Stack',
          title: 'Production ready Kit with all the essentials',
          description: 'I\'ve built a production ready boilerplate with all the essentials you need to build your SaaS. It comes with authentication, payments, user management, and more. Focus on building your unique features while Nuxtbe covers the rest.',
          videoSrc: '/landing/demo.mp4',
          advantages: [
            {
              text: 'Nuxt, Vue, TypeScript, Tailwind CSS, Shadcn Vue components',
              icon: 'mdi:heart-outline',
            },
            {
              text: 'Clean and modern codebase',
              icon: 'mdi:code-braces',
            },
            {
              text: 'Pre-configured authentication and payment systems',
              icon: 'mdi:shield-lock-outline',
            },
          ],
        },
        {
          badge: 'Effortless Payments',
          title: 'Seamless Integration with Stripe and Lemonsqueezy',
          description: 'Simplify your SaaS payment workflows with pre-built integrations for Stripe and Lemonsqueezy. Manage subscriptions, process payments, and handle refunds with minimal setup. Focus on growing your business while I handle the complexities of payment processing.',
          videoSrc: '/landing/demo.mp4',
          advantages: [
            {
              text: 'Pre-integrated with Stripe for secure payments',
              icon: 'simple-icons:stripe',
            },
            {
              text: 'Support for subscription management via Lemonsqueezy',
              icon: 'simple-icons:lemonsqueezy',
            },
            {
              text: 'Support for one-time and recurring payments',
              icon: 'mdi:cash-multiple',
            },
            {
              text: 'Ready-made payment UI components for quick setup',
              icon: 'mdi:credit-card-outline',
            },
          ],
        },
      ]"
    />

    <section class="flex flex-col items-center justify-center gap-12">
      <h2 class="text-4xl font-bold text-center max-w-2xl mx-auto">
        Use bento grid to showcase your product features
      </h2>
      <LazyBentoGrid
        hydrate-on-visible
        class="grid w-full auto-rows-[22rem] grid-cols-3 gap-4 lg:grid-rows-3"
      >
        <LazyBentoGridCard
          v-for="(item, index) in bentoGridItems"
          v-bind="item"
          :key="index"
          hydrate-on-visible
          :class="item.class"
        >
          <template
            v-if="item.image"
            #background
          >
            <div
              class="absolute right-0 top-0 size-full bg-center opacity-70 transition duration-150 ease-in-out group-hover:opacity-20"
              :style="`background-image: url('${item.image}')`"
            />
          </template>
        </LazyBentoGridCard>
      </LazyBentoGrid>
    </section>

    <section>
      <LazyAppsCard
        hydrate-on-visible
        :columns="5"
        :rows="3"
        badge="Easy integration"
        title="Showcase your integrations"
        description="Point out your integrations and how they work together to create a seamless experience for your users."
        icon="logos:kickstarter-icon"
      />
    </section>

    <section>
      <h2 class="text-4xl font-bold text-center max-w-2xl mx-auto">
        Use story line to tell about your journey, your features or use it as a changelog.
      </h2>
      <LazyStoryLine
        hydrate-on-visible
        alignment="left"
        :items="storyLineItems"
      />
    </section>

    <section class="flex flex-col items-center justify-center gap-6">
      <h2 class="text-4xl font-bold text-center max-w-2xl mx-auto">
        Join to dozens of happy creators who already use Nuxtbe
      </h2>
    </section>

    <section>
      <LazyMarquee class="[--duration:20s]">
        <LazyReviewCard
          v-for="review in reviews"
          :key="review.username"
          :img="review.img"
          :name="review.name"
          :username="review.username"
          :body="review.body"
        />
      </LazyMarquee>
    </section>

    <section id="pricing">
      <LazyPricingCards
        hydrate-on-visible
      />
    </section>

    <section>
      <LazyTestimonialsList
        hydrate-on-visible
        variant="centered"
        :testimonials="testimonials"
      />
    </section>

    <section>
      <LazyWhoAmI
        hydrate-on-visible
        avatar="/avatar.svg"
        name="Vladyslav"
        details="Creator of Nuxtbe 👋"
        description="With a decade of experience as a software engineer at leading tech companies,
          I've channeled my passion into creating digital products as a solo founder. And the main issue i've faced
          right at the start was the big amount of time i had to spend to get in place pretty repetitive things.
          So Nuxtbe was born as a solution for this. This Kit empowers entrepreneurs like you and
          me to transform your SaaS ideas into reality quickly and efficiently, without a need to spend dozens and
          hundreds of hours on repetitive and time-consuming tasks.
          I'm dedicated to supporting your journey and ensuring your success, so feel free to contact me if you have any questions or ideas for the product.
          You may find me on Twitter, LinkedIn, or GitHub"
        variant="featured"
        shape="circle"
        size="lg"
        :social-links="[
          {
            platform: 'x',
            url: 'https://x.com/stvladyslav',
          },
          {
            platform: 'linkedin',
            url: 'https://linkedin.com/in/stvladyslav',
          },
          {
            platform: 'github',
            url: 'https://github.com/stvladyslav',
          },
        ]"
      />
    </section>

    <section>
      <LazyMainFAQ
        hydrate-on-visible
        :title="faqTitle"
        :description="faqDescription"
        :items="faqItems"
      />
    </section>
  </div>
</template>
