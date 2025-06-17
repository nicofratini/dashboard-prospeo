import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { fromHighlighter } from '@shikijs/markdown-it/core';
import type { HighlighterCore } from 'shiki/core';

export const useMarkdown = () => {
  // Use Nuxt's built-in color mode and shiki highlighter
  const isDark = useState('color-mode', () => 'dark');
  const { $shikiHighlight } = useNuxtApp();

  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });

  md.use(
    fromHighlighter($shikiHighlight as HighlighterCore, {
      theme: isDark.value === 'dark' ? 'material-theme-ocean' : 'material-theme-lighter',
    }),
  );

  // Store the original fence renderer
  const defaultFenceRenderer = md.renderer.rules.fence!;

  // Override the fence renderer to add a header with language and copy button
  md.renderer.rules.fence = (tokens: any[], idx: number, options: any, env: any, slf: any) => {
    const token = tokens[idx];
    const lang = token?.info || 'text';

    // Get the highlighted code from the default renderer
    const highlightedCode = defaultFenceRenderer(tokens, idx, options, env, slf);

    // Create a custom code block with header using Tailwind classes
    return `
      <div class="rounded-lg border bg-[#0d1117] dark:bg-[#0d1117] overflow-hidden">
        <div class="flex items-center justify-between px-4 py-2 bg-[#161b22] dark:bg-[#161b22] border-b border-[#30363d]">
          <div class="font-mono text-xs text-[#c9d1d9]">${lang}</div>
        </div>
        <div class="overflow-x-auto">
          ${highlightedCode}
        </div>
      </div>
    `;
  };

  // Function to convert markdown to HTML
  const parseMarkdown = (markdownText: string): string => {
    if (!markdownText || !md) {
      return markdownText;
    }

    const html = md.render(markdownText);
    return DOMPurify.sanitize(html);
  };

  return { parseMarkdown };
};
