<script setup lang="ts">
import { string, object } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { toast } from 'vue-sonner';

const contactSchema = object({
  name: string().min(2, 'Name must be at least 2 characters'),
  email: string().email('Please enter a valid email'),
  message: string().min(10, 'Message must be at least 10 characters'),
});

const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(contactSchema),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onSubmit = handleSubmit(async ({ name, email, message }) => {
  toast.success('Message sent successfully');
});
</script>

<template>
  <div class="flex flex-col gap-4 justify-center items-center my-24">
    <div class="flex flex-col gap-1 justify-start items-center">
      <h1 class="text-4xl font-bold">
        Contact
      </h1>
      <p class="text-md text-muted-foreground">
        Contact us for any questions or feedback.
      </p>
    </div>
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
        <CardDescription>
          I will get back to you as soon as possible
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          class="flex flex-col items-center justify-center gap-4"
          @submit="onSubmit"
        >
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
                    v-bind="componentField"
                    placeholder="Your name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem v-auto-animate>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    v-bind="componentField"
                    placeholder="your@email.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>
          <div class="w-full">
            <FormField
              v-slot="{ componentField }"
              name="message"
            >
              <FormItem v-auto-animate>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea
                    v-bind="componentField"
                    placeholder="Your message..."
                    class="min-h-[120px]"
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
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
