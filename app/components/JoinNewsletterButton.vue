<script setup lang="ts">
import { toast } from 'vue-sonner';
import { object, string } from 'zod';

const openDialog = ref(false);
const openDrawer = ref(false);

const formSchema = toTypedSchema(
  object({
    email: string({
      required_error: 'Email is required',
      invalid_type_error: 'Invalid email',
    })
      .email({ message: 'Invalid email address' })
      .min(1, { message: 'Email is required' })
      .max(32, { message: 'Email must be less than 32 characters' }),
    full_name: string().max(64, { message: 'Name must be less than 64 characters' }).optional(),
    note: string().max(500, { message: 'Note must be less than 500 characters' }).optional(),
  }),
);

const { handleSubmit } = useForm({
  validationSchema: formSchema,
});

const onSubmit = handleSubmit(async ({ email, full_name, note }) => {
  // You may want to add ratelimiting to avoid abuse. You may use several tools for that.
  // Details can be found here https://supabase.com/docs/guides/api/securing-your-api.
  // Or use https://nuxt-security.vercel.app/documentation/middleware/rate-limiter
  // Or upstash ratelimiter

  toast.promise(
    $fetch('/api/subscribers', {
      method: 'POST',
      body: { email, full_name, note },
    }).catch((error) => {
      throw new Error(error.data?.message || 'Something went wrong');
    }), {
      loading: 'Subscribing to newsletter...',
      success: () => {
        openDialog.value = false;
        openDrawer.value = false;
        return 'Welcome to newsletter! 🎉';
      },
      error: (error: Error) => {
        openDialog.value = false;
        openDrawer.value = false;
        return error.message;
      },
      duration: 3000,
    });
});
</script>

<template>
  <div>
    <Dialog v-model:open="openDialog">
      <DialogTrigger as-child>
        <Button
          size="lg"
          variant="outline"
          class="hidden md:block min-w-60 delay-300 duration-700 animate-in fade-in transition-transform zoom-in-95 fill-mode-both"
        >
          Join the waitlist
        </Button>
      </DialogTrigger>

      <LazyDialogContent>
        <DialogHeader>
          <DialogTitle>Join Waitlist</DialogTitle>
          <DialogDescription>
            Join the waiting list and get a discount when I launch!
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
                name="email"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@mail.com"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="w-full">
              <FormField
                v-slot="{ componentField }"
                name="name"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Anonymous"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="w-full">
              <FormField
                v-slot="{ componentField }"
                name="note"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Share your thoughts</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      id="notes"
                      placeholder="Please share your expectations for this product."
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
              Subscribe
            </Button>
          </form>
        </div>
      </LazyDialogContent>
    </Dialog>
    <LazyDrawer v-model:open="openDrawer">
      <DrawerTrigger as-child>
        <Button
          size="lg"
          class="min-w-80 block md:hidden delay-300 duration-700 animate-in fade-in zoom-in-95 fill-mode-both"
        >
          Join the waitlist
        </Button>
      </DrawerTrigger>
      <LazyDrawerContent>
        <DrawerHeader>
          <DrawerTitle>Join Waitlist</DrawerTitle>
          <DrawerDescription>
            Join the waiting list and get a discount when I launch!
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
                name="email"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your@mail.com"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="w-full">
              <FormField
                v-slot="{ componentField }"
                name="full_name"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Anonymous"
                      v-bind="componentField"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>
            <div class="w-full">
              <FormField
                v-slot="{ componentField }"
                name="note"
              >
                <FormItem v-auto-animate>
                  <FormLabel>Share your thoughts</FormLabel>
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      id="notes"
                      placeholder="Please share your expectations for this product."
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
              Subscribe
            </Button>
          </form>
        </div>
      </LazyDrawerContent>
    </LazyDrawer>
  </div>
</template>
