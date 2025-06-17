<script setup lang="ts">
const { contactEmail } = useAppConfig().general;
</script>

<template>
  <TooltipProvider :delay-duration="0">
    <Tooltip>
      <TooltipTrigger>
        <Popover>
          <PopoverTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="size-8"
            >
              <Icon
                name="line-md:question-circle"
                mode="svg"
                size="1rem"
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="min-w-96">
            <div class="flex flex-col items-start gap-4">
              <h3 class="text-lg">
                Need help with your project?
              </h3>
              <p class="text-sm text-muted-foreground">
                For issues with your project created with our boilerplate, or
                other inquiries about our services.
              </p>
              <div class="flex flex-row justify-between items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  as-child
                >
                  <NuxtLink :to="`mailto:${contactEmail}`">
                    <Icon
                      name="line-md:email"
                      mode="svg"
                      class="mr-2"
                      size="1rem"
                    />
                    Email us
                  </NuxtLink>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  as-child
                >
                  <NuxtLink to="/docs">
                    <Icon
                      name="line-md:text-box-multiple"
                      mode="svg"
                      class="mr-2"
                      size="1rem"
                    />
                    Docs
                  </NuxtLink>
                </Button>
              </div>
              <p class="text-sm text-muted-foreground">
                Expected response time is based on your billing plan. Projects on
                paid plans are prioritized.
              </p>

              <Separator />
              <h3 class="text-lg">
                Reach out to the community
              </h3>
              <p class="text-sm text-muted-foreground">
                For other support, including questions on our boilerplate code, advice, or best practices.
              </p>

              <div class="flex flex-row justify-between items-center w-full gap-4">
                <Button
                  as-child
                  variant="outline"
                  class="border-indigo-700 w-full"
                >
                  <NuxtLink>
                    <Icon
                      name="line-md:discord"
                      mode="svg"
                      class="mr-2"
                      size="1rem"
                    />
                    Discord
                  </NuxtLink>
                </Button>
                <Button
                  as-child
                  variant="outline"
                  class="border-white w-full"
                >
                  <NuxtLink
                    to="https://github.com/Nuxtbe/nuxtbe/issues"
                    external
                    target="_blank"
                  >
                    <Icon
                      name="line-md:github-loop"
                      mode="svg"
                      class="mr-2"
                      size="1rem"
                    />
                    GitHub
                  </NuxtLink>
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TooltipTrigger>
      <TooltipContent>
        <p>Help</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
