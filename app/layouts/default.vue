<template>
  <div>
    <Header />
    <main class="px-6 md:px-24">
      <slot />
    </main>
    <LazyFooter hydrate-on-visible />
  </div>
</template>
