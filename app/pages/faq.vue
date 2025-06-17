<script setup lang="ts">
const { title: faqTitle, description: faqDescription, items: faqItems } = useAppConfig().faq;
const { contactEmail } = useAppConfig().general;

useSchemaOrg([
  defineWebPage({
    '@type': 'FAQPage',
  }),
  // Map FAQ items to Schema.org Question objects
  ...faqItems.map(item =>
    defineQuestion({
      name: item.title,
      acceptedAnswer: item.content,
    }),
  ),
]);
</script>

<template>
  <div class="w-full flex flex-col items-center px-4 py-8">
    <MainFAQ
      class="w-1/2"
      type="vertical"
      :title="faqTitle"
      :description="faqDescription"
      :items="faqItems"
    />

    <div class="mt-12 p-6 bg-muted/50 rounded-lg w-1/2">
      <h2 class="text-xl font-semibold mb-4">
        Still have questions?
      </h2>
      <p class="mb-4 text-muted-foreground">
        Can't find the answer you're looking for? Please contact our support team.
      </p>
      <Button as-child>
        <NuxtLink
          :to="`mailto:${contactEmail}`"
          class="flex items-center gap-2"
        >
          <Icon
            name="mdi:email-outline"
            class="w-4 h-4"
          />
          {{ contactEmail }}
        </NuxtLink>
      </Button>
    </div>
  </div>
</template>
