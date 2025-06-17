<script setup lang="ts">
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'reka-ui';
import { array, number, object, string } from 'zod';
import type { Database } from '~~/types/database.types';

interface Tag {
  id: number;
  name: string;
}

const client = useSupabaseClient<Database>();

const emit = defineEmits(['data:refresh']);

const { data: tags, error: tagsError } = await useLazyAsyncData('suggestions-tags', async () => {
  const { data } = await client.from('suggestion_tags').select('id,name');
  return data;
});

if (tagsError.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to fetch tags',
  });
}

const { data: suggestionTypes, error: suggestionTypesError } = await useLazyAsyncData('suggestion-types', async () => {
  const { data } = await client.from('suggestion_types').select('id,name');
  return data;
});

if (suggestionTypesError.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Failed to fetch suggestion types',
  });
}

const openDialog = ref(false);
const openDrawer = ref(false);
const tagsOpen = ref(false);
const searchTerm = ref('');

const handleTagSelect = (ev: any, tags: Tag[]) => {
  if (typeof ev.detail.value.name === 'string') {
    searchTerm.value = '';
    tags.push(ev.detail.value);
  }
};

const filterFunction = (list: Tag[], searchTerm: string) => {
  return list.filter((tag) => {
    return tag.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
};

const formSchema = toTypedSchema(
  object({
    title: string({
      required_error: 'Title is required',
      invalid_type_error: 'Invalid title',
    })
      .min(1, { message: 'Title is required' })
      .max(256, { message: 'Title must be less than 256 characters' }),
    details: string().max(1024, { message: 'Details must contain less than 1024 characters' }).optional(),
    tags: array(object({
      id: number(),
      name: string(),
    })).optional().default([]),
    type: string().optional(),
  }),
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    tags: [],
  },
});

const onSubmit = handleSubmit(async ({ title, details, tags, type }) => {
  const { data, error } = await client.rpc('add_suggestion_with_tags', {
    details: details || '',
    tag_ids: tags.map(tag => tag.id),
    title,
    type: Number(type),
  });

  if (error) {
    handleApiErrorWithToast(error, 'Unable to create suggestion. Please try again later.');
    return;
  }

  if (data) {
    openDialog.value = false;
    emit('data:refresh');
  }
});
</script>

<template>
  <Dialog
    v-model:open="openDialog"
    @update:open="(value) => resetForm()"
  >
    <DialogTrigger as-child>
      <Button
        size="lg"
        class="min-w-24 w-full md:w-64 hidden md:block delay-500 duration-700 animate-in fade-in zoom-in-95 fill-mode-both"
      >
        Add Suggestion
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Make a suggestion</DialogTitle>
        <DialogDescription>
          Share your ideas and suggestions with us.
        </DialogDescription>
      </DialogHeader>
      <div>
        <form
          class="flex flex-col items-center justify-center gap-4"
          @submit="onSubmit"
        >
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              :validate-on-blur="false"
              name="title"
            >
              <FormItem v-auto-animate>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    v-bind="componentField"
                    placeholder="A short, descriptive title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="type"
            >
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      <SelectItem
                        v-for="suggestionType in suggestionTypes"
                        :key="suggestionType.id"
                        :value="suggestionType.id.toString()"
                      >
                        {{ suggestionType.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="tags"
            >
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagsInput
                    class="px-0 gap-0"
                    :model-value="componentField.modelValue"
                    :display-value="value => (value as Tag).name"
                  >
                    <div class="flex gap-2 flex-wrap items-center px-3">
                      <TagsInputItem
                        v-for="item in componentField.modelValue"
                        :key="item"
                        :value="item"
                      >
                        <TagsInputItemText />
                        <TagsInputItemDelete />
                      </TagsInputItem>
                    </div>
                    <ComboboxRoot
                      v-model="componentField.modelValue"
                      v-model:open="tagsOpen"
                      v-model:search-term="searchTerm"
                      :filter-function="filterFunction"
                      class="w-full"
                    >
                      <ComboboxAnchor as-child>
                        <ComboboxInput
                          placeholder="Tags..."
                          as-child
                        >
                          <TagsInputInput
                            class="w-full px-3"
                            :class="componentField.modelValue?.length > 0 ? 'mt-2' : ''"
                            @keydown.enter.prevent
                          />
                        </ComboboxInput>
                      </ComboboxAnchor>
                      <ComboboxPortal>
                        <ComboboxContent>
                          <CommandList
                            position="popper"
                            class="z-[100] w-[--reka-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                          >
                            <CommandEmpty />
                            <CommandGroup>
                              <CommandItem
                                v-for="tag in tags?.filter(i => !componentField.modelValue?.includes(i))"
                                :key="tag.id"
                                :value="tag"
                                @select.prevent="handleTagSelect($event, componentField.modelValue)"
                              >
                                {{ tag.name }}
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </ComboboxContent>
                      </ComboboxPortal>
                    </ComboboxRoot>
                  </TagsInput>
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="details"
            >
              <FormItem v-auto-animate>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    id="notes"
                    placeholder="Please keep only one suggestion per post."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <Button
            type="submit"
            class="w-full"
          >
            Create post
          </Button>
        </form>
      </div>
    </DialogContent>
  </Dialog>
  <LazyDrawer v-model:open="openDrawer">
    <DrawerTrigger as-child>
      <Button
        size="lg"
        class="min-w-80 w-full block md:hidden delay-500 duration-700 animate-in fade-in zoom-in-95 fill-mode-both"
      >
        Add suggestion
      </Button>
    </DrawerTrigger>
    <LazyDrawerContent>
      <DrawerHeader>
        <DrawerTitle>Make a suggestion</DrawerTitle>
        <DrawerDescription>
          Share your ideas and suggestions with us.
        </DrawerDescription>
      </DrawerHeader>
      <div>
        <form
          class="flex flex-col items-center justify-center gap-4 px-8 pb-8"
          @submit="onSubmit"
        >
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              :validate-on-blur="false"
              name="title"
            >
              <FormItem v-auto-animate>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    v-bind="componentField"
                    placeholder="A short, descriptive title"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="type"
            >
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select v-bind="componentField">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      <SelectItem
                        v-for="suggestionType in suggestionTypes"
                        :key="suggestionType.id"
                        :value="suggestionType.id.toString()"
                      >
                        {{ suggestionType.name }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="tags"
            >
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagsInput
                    class="px-0 gap-0"
                    :model-value="componentField.modelValue"
                    :display-value="value => (value as Tag).name"
                  >
                    <div class="flex gap-2 flex-wrap items-center px-3">
                      <TagsInputItem
                        v-for="item in componentField.modelValue"
                        :key="item"
                        :value="item"
                      >
                        <TagsInputItemText />
                        <TagsInputItemDelete />
                      </TagsInputItem>
                    </div>
                    <ComboboxRoot
                      v-model="componentField.modelValue"
                      v-model:open="tagsOpen"
                      v-model:search-term="searchTerm"
                      class="w-full"
                    >
                      <ComboboxAnchor as-child>
                        <ComboboxInput
                          placeholder="Tags..."
                          as-child
                        >
                          <TagsInputInput
                            class="w-full px-3"
                            :class="componentField.modelValue?.length > 0 ? 'mt-2' : ''"
                            @keydown.enter.prevent
                          />
                        </ComboboxInput>
                      </ComboboxAnchor>
                      <ComboboxPortal>
                        <ComboboxContent>
                          <CommandList
                            position="popper"
                            class="z-[100] w-[--reka-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
                          >
                            <CommandEmpty />
                            <CommandGroup>
                              <CommandItem
                                v-for="tag in tags?.filter(i => !componentField.modelValue?.includes(i))"
                                :key="tag.id"
                                :value="tag"
                                @select.prevent="handleTagSelect($event, componentField.modelValue)"
                              >
                                {{ tag.name }}
                              </CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </ComboboxContent>
                      </ComboboxPortal>
                    </ComboboxRoot>
                  </TagsInput>
                </FormControl>
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="details"
            >
              <FormItem v-auto-animate>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    id="notes"
                    placeholder="Please keep only one suggestion per post."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <Button
            type="submit"
            class="w-full"
          >
            Create post
          </Button>
        </form>
      </div>
    </LazyDrawerContent>
  </LazyDrawer>
</template>
