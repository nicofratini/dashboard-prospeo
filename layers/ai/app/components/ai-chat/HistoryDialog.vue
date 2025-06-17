<script setup lang="ts">
/**
 * ChatHistoryDialog component
 *
 * Provides a dialog for browsing and searching chat history.
 * Uses Drawer on mobile and CommandDialog on desktop.
 */

interface ChatHistoryItem {
  id: string;
  title: string;
  date: string;
  preview: string;
}

const isOpen = defineModel<boolean>('isOpen');

const emit = defineEmits<{
  selectChat: [chatId: string];
}>();

// Responsive layout
const isMobile = useMediaQuery('(max-width: 640px)');

// Search state
const searchQuery = ref('');
const commandSearchQuery = ref('');

// Keyboard shortcut handling
const { meta_k, ctrl_k } = useMagicKeys();

whenever([meta_k, ctrl_k], () => {
  isOpen.value = true;
});

// Mock data for now - will be replaced with actual chat history later
const mockChatHistory = ref<ChatHistoryItem[]>([
  {
    id: '1',
    title: 'Project Planning Discussion',
    date: '2 hours ago',
    preview: 'We discussed the timeline for the new feature implementation...',
  },
  {
    id: '2',
    title: 'Code Review Feedback',
    date: 'Yesterday',
    preview: 'The PR needs some adjustments to the authentication flow...',
  },
  {
    id: '3',
    title: 'API Integration Help',
    date: '3 days ago',
    preview: 'How to properly handle authentication tokens in the API calls...',
  },
  {
    id: '4',
    title: 'Debugging Session',
    date: 'Last week',
    preview: 'We identified the root cause of the performance issue in the...',
  },
  {
    id: '5',
    title: 'Feature Brainstorming',
    date: 'Last month',
    preview: 'Ideas for improving the user onboarding experience...',
  },
]);

// Filtered chat history based on search query for mobile drawer
const filteredChatHistory = computed(() => {
  if (!searchQuery.value) return mockChatHistory.value;

  const query = searchQuery.value.toLowerCase();
  return mockChatHistory.value.filter(chat =>
    chat.title.toLowerCase().includes(query)
    || chat.preview.toLowerCase().includes(query),
  );
});

// Filtered chat history based on command search query for desktop
const filteredCommandChatHistory = computed(() => {
  if (!commandSearchQuery.value) return mockChatHistory.value;

  const query = commandSearchQuery.value.toLowerCase();
  return mockChatHistory.value.filter(chat =>
    chat.title.toLowerCase().includes(query)
    || chat.preview.toLowerCase().includes(query),
  );
});

// Dialog actions
const closeDialog = () => {
  isOpen.value = false;
};

const selectChat = (chatId: string) => {
  emit('selectChat', chatId);
  closeDialog();
};

// Reset search queries when dialog opens/closes
watch(() => isOpen.value, (isOpen) => {
  if (!isOpen) {
    searchQuery.value = '';
    commandSearchQuery.value = '';
  }
});
</script>

<template>
  <!-- Use Drawer on mobile devices -->
  <Drawer
    v-if="isMobile"
    :open="isOpen"
    @update:open="isOpen = $event"
  >
    <DrawerContent class="px-4 pb-6">
      <DrawerHeader>
        <DrawerTitle class="text-xl font-accent font-light">
          Chat History
        </DrawerTitle>
        <DrawerDescription>
          Search and browse your previous conversations
        </DrawerDescription>
      </DrawerHeader>

      <div class="px-4 space-y-4">
        <!-- Search input -->
        <div class="relative">
          <Icon
            name="mdi:magnify"
            class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4"
          />
          <Input
            v-model="searchQuery"
            placeholder="Search conversations..."
            class="pl-10"
          />
        </div>

        <!-- Chat history list -->
        <div class="space-y-2 max-h-[60vh] overflow-y-auto">
          <div
            v-for="chat in filteredChatHistory"
            :key="chat.id"
            class="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
            @click="selectChat(chat.id)"
          >
            <div class="flex justify-between items-start mb-1">
              <h3 class="font-medium text-sm">
                {{ chat.title }}
              </h3>
              <span class="text-xs text-muted-foreground">{{ chat.date }}</span>
            </div>
            <p class="text-xs text-muted-foreground line-clamp-2">
              {{ chat.preview }}
            </p>
          </div>

          <div
            v-if="filteredChatHistory.length === 0"
            class="py-8 text-center"
          >
            <Icon
              name="mdi:chat-remove-outline"
              class="size-8 mx-auto mb-2 text-muted-foreground"
            />
            <p class="text-sm text-muted-foreground">
              No conversations found
            </p>
          </div>
        </div>
      </div>

      <DrawerFooter>
        <Button @click="closeDialog">
          Close
        </Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>

  <!-- Keyboard shortcut hint (hidden) -->
  <div
    v-if="!isMobile"
    class="hidden"
  >
    <p class="text-sm text-muted-foreground">
      Press
      <kbd
        class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
      >
        <span class="text-xs">⌘</span>K
      </kbd>
    </p>
  </div>

  <!-- Apply Tailwind classes directly to the CommandDialog -->
  <div
    v-if="!isMobile"
    class="w-full mx-auto"
  >
    <CommandDialog
      :open="isOpen"
      class="w-full"
      @update:open="isOpen = $event"
    >
      <CommandInput
        v-model="commandSearchQuery"
        placeholder="Search conversations..."
        class="border-none focus:ring-0"
      />
      <CommandList class="max-h-[450px]">
        <CommandEmpty>
          <div class="py-6 text-center">
            <Icon
              name="mdi:chat-remove-outline"
              class="size-8 mx-auto mb-2 text-muted-foreground"
            />
            <p class="text-sm text-muted-foreground">
              No conversations found
            </p>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Recent Conversations">
          <CommandItem
            v-for="chat in filteredCommandChatHistory"
            :key="chat.id"
            :value="chat.id + chat.title"
            class="py-3"
            @select="selectChat(chat.id)"
          >
            <div class="flex-1 overflow-hidden">
              <div class="flex justify-between items-start">
                <h3 class="font-medium truncate">
                  {{ chat.title }}
                </h3>
                <span class="text-xs text-muted-foreground ml-2 shrink-0">{{ chat.date }}</span>
              </div>
              <p class="text-sm text-muted-foreground truncate">
                {{ chat.preview }}
              </p>
            </div>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>
