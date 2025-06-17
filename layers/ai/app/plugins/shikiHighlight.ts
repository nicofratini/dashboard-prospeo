import { defineNuxtPlugin } from '#app';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma';

export default defineNuxtPlugin(async () => {
  const highlighter = await createHighlighterCore({
    themes: [
      import('@shikijs/themes/material-theme-lighter'),
      import('@shikijs/themes/material-theme-ocean'),
      import('@shikijs/themes/monokai')
    ],
    langs: [
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/python'),
      import('@shikijs/langs/html'),
      import('@shikijs/langs/css'),
      import('@shikijs/langs/vue'),
      import('@shikijs/langs/bash')
    ],
    engine: createOnigurumaEngine(import('shiki/wasm'))
  });

  return {
    provide: {
      shikiHighlight: highlighter,
    },
  };
});
