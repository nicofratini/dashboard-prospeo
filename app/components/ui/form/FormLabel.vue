<script lang="ts" setup>
import type { LabelProps } from 'reka-ui';
import type { HTMLAttributes } from 'vue';
import { useFormField } from './useFormField';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>();

const { error, formItemId } = useFormField();
</script>

<template>
  <Label
    :class="cn(
      error && 'text-destructive',
      props.class,
    )"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
