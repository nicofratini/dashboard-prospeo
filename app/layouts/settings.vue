<template>
  <div class="flex min-h-screen w-full flex-col">
    <header class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <NuxtLink
          href="#"
          class="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Icon
            name="mdi:package-variant-closed"
            class="size-6"
          />
          <span class="sr-only">V Inc</span>
        </NuxtLink>
        <NuxtLink
          href="#"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </NuxtLink>
        <NuxtLink
          href="#"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Orders
        </NuxtLink>
        <NuxtLink
          href="#"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Products
        </NuxtLink>
        <NuxtLink
          href="#"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Customers
        </NuxtLink>
        <NuxtLink
          href="#"
          class="text-foreground transition-colors hover:text-foreground"
        >
          Settings
        </NuxtLink>
      </nav>
      <Sheet>
        <SheetTrigger as-child>
          <Button
            variant="outline"
            size="icon"
            class="shrink-0 md:hidden"
          >
            <Icon
              name="mdi:menu"
              class="size-6"
            />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav class="grid gap-6 text-lg font-medium">
            <NuxtLink
              href="#"
              class="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 class="h-6 w-6" />
              <span class="sr-only">V Inc</span>
            </NuxtLink>
            <NuxtLink
              href="#"
              class="text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              href="#"
              class="text-muted-foreground hover:text-foreground"
            >
              Orders
            </NuxtLink>
            <NuxtLink
              href="#"
              class="text-muted-foreground hover:text-foreground"
            >
              Products
            </NuxtLink>
            <NuxtLink
              href="#"
              class="text-muted-foreground hover:text-foreground"
            >
              Customers
            </NuxtLink>
            <NuxtLink
              href="#"
              class="hover:text-foreground"
            >
              Settings
            </NuxtLink>
          </nav>
        </SheetContent>
      </Sheet>
      <div class="flex w-full items-center justify-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <UserMenu />
      </div>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>
