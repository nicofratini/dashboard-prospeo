<template>
  <div class="flex">
    <Transition
      name="fade"
      mode="out-in"
    >
      <Icon
        v-if="copied === false"
        name="mdi:content-copy"
        class="block cursor-pointer self-center text-muted-foreground hover:text-primary"
        mode="svg"
        @click="handleClick"
      />
      <Icon
        v-else
        ref="checkIconRef"
        name="mdi:check"
        class="block cursor-pointer self-center text-muted-foreground hover:text-primary"
        mode="svg"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner';

const { code } = defineProps<{
  code: string;
}>();

/* const { toast } = useToast(); */

const { copy } = useClipboard({ source: code });
const copied = ref(false);

async function handleClick() {
  await copy(code);
  copied.value = true;

  const { codeCopyToast, codeCopyToastText } = useAppConfig().boilerplateDocs.main;

  if (codeCopyToast) {
    toast(codeCopyToastText, { closeButton: true });
  }

  /* if (useConfig().value.main.codeCopyToast) {
     toast({
       description: useConfig().value.main.codeCopyToastText,
     });
   } */
}

const checkIconRef = ref<HTMLElement>();
onClickOutside(checkIconRef, () => {
  copied.value = false;
});
</script>
