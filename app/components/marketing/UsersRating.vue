<script setup lang="ts">
const supabase = useSupabaseClient();
const subscribersCount = ref(0);

/*
  Fetch subscribers count from Supabase.
  Other options is to count users who bought your product by fetching profiles with is_subscribed = true.
*/
const { data: count, status } = await useLazyAsyncData('subscribersCount', async () => {
  const { count } = await supabase
    .from('newsletters_subscribers')
    .select('*', { count: 'exact', head: true });
  return count;
});
subscribersCount.value = (count.value ?? 0) + 1687; // Constant value is added for demo purposes, just remove it to show real data

const {
  stars = 5,
  avatars = [
    {
      src: 'avatar.svg',
      fallbackValue: 'CN',
    },
    {
      src: 'avatar.svg',
      fallbackValue: 'CN',
    },
    {
      src: 'avatar.svg',
      fallbackValue: 'CN',
    },
    {
      src: 'avatar.svg',
      fallbackValue: 'CN',
    },
    {
      src: 'avatar.svg',
      fallbackValue: 'CN',
    },
  ],
} = defineProps<{
  stars?: number;
  avatars?: { src: string; fallbackValue: string }[];
}>();
</script>

<template>
  <div
    v-if="status === 'success'"
    class="flex flex-col lg:flex-row justify-center items-center gap-4 mt-6"
  >
    <AvatarGroup
      :avatars
      class="inline-flex scale-110 lg:scale-100"
    />
    <div class="flex flex-col justify-center items-center lg:items-start">
      <div class="inline-flex">
        <!-- [TIP] line-md:star-filled-half can be used for half stars -->
        <Icon
          v-for="i in stars"
          :key="i"
          name="line-md:star-filled"
          mode="svg"
          class="text-amber-500 h-6 w-6"
        />
      </div>
      <div class="text-sm text-muted-foreground">
        Join to
        <span class="font-bold text-md text-foreground">
          <NumberTicker :value="subscribersCount" />
        </span> users who are not wasting their time anymore
      </div>
    </div>
  </div>
</template>
