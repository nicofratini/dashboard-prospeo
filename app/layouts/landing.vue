<template>
  <div>
    <Header />
    <main class="px-6 md:px-24">
      <div
        class="absolute inset-x-0 top-10 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        aria-hidden="true"
      >
        <div
          class="aspect-video w-[69.25rem] flex-none bg-gradient-to-r from-cyan-500 to-emerald-800 dark:opacity-25 opacity-15"
          style="clip-path: polygon(0 0, 100% 0, 100% 60%, 90% 80%, 75% 60%, 60% 75%, 45% 60%, 30% 80%, 10% 60%, 0 60%);"
        />
      </div>
      <svg
        class="absolute inset-0 -z-10 h-full w-full stroke-black/5 dark:stroke-white/5 [mask-image:radial-gradient(75%_50%_at_top_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero"
            width="80"
            height="80"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M.5 200V.5H200"
              fill="none"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          stroke-width="0"
          fill="url(#hero)"
        />
      </svg>
      <slot />
    </main>
    <Footer />
  </div>
</template>
