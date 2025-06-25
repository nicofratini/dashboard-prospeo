<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
});

const navLinks = [
  { title: 'General', href: '/dashboard/settings/general' },
  { title: 'Billing', href: '/dashboard/settings/billing' },
  { title: 'Security', href: '/dashboard/settings/security' },
  { title: 'Advanced', href: '/dashboard/settings/advanced' },
];

const {
  currentTeam,
} = useTeam();

async function handlePortalClick() {
  try {
    const response = await $fetch(`/api/billing/portal-url?team_id=${currentTeam.value.id}`);
    navigateTo(response.url, { external: true });
  }
  catch (e) {
    console.log(e);
  }
}
</script>

<template>
  <div class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <h1 class="text-3xl font-semibold">
        Settings
      </h1>
    </div>
    <div class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <nav class="grid gap-4 text-sm text-muted-foreground">
        <NuxtLink
          v-for="(link, i) in navLinks"
          :key="i"
          :href="link.href"
          :class="link.href === $route.path ? 'font-semibold text-primary' : ''"
        >
          {{ link.title }}
        </NuxtLink>
      </nav>

      <form
        class="grid gap-6"
        @submit="onSubmit"
      >
        <Alert variant="warning">
          <AlertTitle class="flex items-center gap-2">
            <Icon
              name="line-md:alert"
              class="h-5 w-5"
            />
            <span class="font-bold">Warning</span>
          </AlertTitle>
          <AlertDescription>
            You are currently modifying the subscription of the team <strong>{{ currentTeam?.name }}</strong>.
          </AlertDescription>
        </Alert>
        <Button
          v-if="currentTeam?.is_subscribed"
          @click.prevent="handlePortalClick"
        >
          Go to portal
        </Button>

        <PricingCards
          v-else
          :is-direct-subscription="true"
          title=""
          description=""
        />
      </form>
    </div>
  </div>
</template>
