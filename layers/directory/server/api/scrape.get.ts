import { object, string, ZodError } from 'zod';
import type { H3Event } from 'h3';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { load } from 'cheerio';
import sanitizeHtml from 'sanitize-html';
import { SYSTEM_MESSAGE } from '../utils/ai-utils';
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

const urlSchema = object({
  url: string().url(),
});

async function fetchImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const contentType = response.headers.get('content-type');

    // If it's not an image, return null
    if (!contentType || !contentType.startsWith('image/')) {
      console.log(`Not an image: ${url}, content type: ${contentType}`);
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // For large images, consider adding server-side image optimization
    // This would involve using a library like sharp or jimp
    // For now, we're returning the original image with size limitation

    // Limit buffer size to max 1MB to ensure reasonable size
    const MAX_SIZE = 1024 * 1024; // 1MB
    if (buffer.length > MAX_SIZE) {
      console.log(`Image too large (${buffer.length} bytes), skipping: ${url}`);
      return null;
    }

    return `data:${contentType};base64,${buffer.toString('base64')}`;
  }
  catch (error) {
    console.error(`Error fetching image from ${url}:`, error);
    return null;
  }
}

// Function to fetch available tags and categories from Supabase
async function fetchTagsAndCategories(event: H3Event) {
  try {
    const client = await serverSupabaseClient(event);

    // Fetch available tags
    const { data: tags, error: tagsError } = await client
      .from('directory_tags')
      .select('name');

    if (tagsError) throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch tags',
    });

    // Fetch available categories
    const { data: categories, error: categoriesError } = await client
      .from('directory_groups')
      .select('name');

    if (categoriesError) throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories',
    });

    return {
      availableTags: tags.map((tag: { name: string }) => tag.name),
      availableCategories: categories.map((category: { name: string }) => category.name),
    };
  }
  catch (error) {
    console.error('Error fetching tags and categories:', error);
    return {
      availableTags: [],
      availableCategories: [],
    };
  }
}

// Function to analyze content with AI
async function analyzeContentWithAI(title: string, description: string, mainContent: string, url: string, availableTags: string[], availableCategories: string[]) {
  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: SYSTEM_MESSAGE,
        },
        {
          role: 'user',
          content: createContentAnalysisPrompt(
            url,
            title,
            description,
            mainContent,
            availableTags,
            availableCategories,
          ),
        },
      ],
    });

    // Use the utility to parse the AI response
    return parseContentAnalysis(result.text);
  }
  catch (error) {
    console.error('AI analysis failed:', error);
    return null;
  }
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Check if user is authenticated
    const user = await serverSupabaseUser(event);

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized: You must be logged in to scrape URLs',
      });
    }
    // Parse query parameters
    const { url } = await getValidatedQuery(event, urlSchema.parse);

    console.log('Scraping URL:', url);

    // Fetch the HTML content
    const response = await fetch(url);

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch URL: ${response.statusText}`,
      });
    }

    const html = await response.text();
    // Sanitize HTML to remove any malicious code
    const sanitizedHtml = sanitizeHtml(html, {
      allowedTags: [
        // Basic structure
        'html', 'head', 'title', 'body', 'div', 'span', 'main', 'section', 'article',
        // Typography
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'strong', 'em', 'i', 'b',
        // Lists
        'ul', 'ol', 'li',
        // Links and images
        'a', 'img',
        // Tables
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        // Other common elements
        'br', 'hr',
        // Meta tags and links (important for metadata scraping)
        'meta', 'link',
        // Additional semantic elements
        'nav', 'header', 'footer', 'aside', 'button', 'small', 'time',
        // Content organization
        'details', 'summary', 'figure', 'figcaption', 'blockquote', 'cite',
      ],
      allowedAttributes: {
        '*': ['id', 'class', 'style'],
        'a': ['href', 'target', 'rel'],
        'img': ['src', 'alt', 'width', 'height'],
        'th': ['colspan', 'rowspan'],
        'td': ['colspan', 'rowspan'],
        'meta': ['name', 'content', 'property', 'charset', 'http-equiv'],
        'link': ['rel', 'href', 'type', 'media', 'sizes', 'crossorigin', 'referrerpolicy'],
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel', 'data'],
      allowedSchemesByTag: {
        img: ['data'],
      },
      allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
      allowProtocolRelative: true,
    });

    const $ = load(sanitizedHtml);

    // Extract and truncate title
    const fullTitle = $('head title').text().trim() || '';

    const title = fullTitle.length > 100
      ? `${fullTitle.slice(0, 97).trim().replace(/\W+$/, '')}...`
      : fullTitle;

    const description = $('meta[name="description"]').attr('content')
      || $('meta[property="og:description"]').attr('content') || '';

    // Find the best image - prioritize larger images when available
    let ogImage = '';

    // First try og:image
    ogImage = $('meta[property="og:image"]').attr('content') || '';

    // If no og:image, look for twitter:image
    if (!ogImage) {
      ogImage = $('meta[name="twitter:image"]').attr('content') || '';
    }

    // If still no image, look for article:image
    if (!ogImage) {
      ogImage = $('meta[property="article:image"]').attr('content') || '';
    }

    const siteUrl = new URL(url);

    // Get favicon with fallbacks
    const favicon = $('link[rel="icon"]').attr('href')
      || $('link[rel="shortcut icon"]').attr('href')
      || $('link[rel="apple-touch-icon"]').attr('href')
      || `${siteUrl.origin}/favicon.ico`
      || '';

    // Additional metadata that might be useful
    const keywords = $('meta[name="keywords"]').attr('content') || '';
    const author = $('meta[name="author"]').attr('content') || '';
    const themeColor = $('meta[name="theme-color"]').attr('content') || '';

    // Extract main content for AI analysis
    const mainContent = $('main, article, .content, #content, body')
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    // Resolve relative URLs
    const resolvedFavicon = favicon ? new URL(favicon, siteUrl).href : '';
    const resolvedOgImage = ogImage ? new URL(ogImage, siteUrl).href : '';

    let imageData = null;
    let faviconData = null;

    if (resolvedOgImage) {
      imageData = await fetchImageAsBase64(resolvedOgImage);
    }

    if (resolvedFavicon) {
      faviconData = await fetchImageAsBase64(resolvedFavicon);
    }

    // Fetch available tags and categories from Supabase
    const { availableTags, availableCategories } = await fetchTagsAndCategories(event);

    // Analyze content with AI - pass available tags and categories
    const aiAnalysis = await analyzeContentWithAI(
      title,
      description,
      mainContent,
      url,
      availableTags,
      availableCategories,
    );

    return {
      success: true,
      metadata: {
        url,
        title,
        description,
        image: resolvedOgImage,
        imageData,
        favicon: resolvedFavicon,
        faviconData,
        domain: siteUrl.hostname,
        keywords,
        author,
        themeColor,
        aiAnalysis: aiAnalysis
          ? {
              summary: aiAnalysis.summary,
              suggestedTags: aiAnalysis.tags || [],
              suggestedCategories: aiAnalysis.categories || [],
              primaryTopic: aiAnalysis.primaryTopic,
              targetAudience: aiAnalysis.targetAudience,
            }
          : null,
      },
    };
  }
  catch (error) {
    console.error('Error scraping website:', error);

    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL parameter',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to scrape website metadata',
    });
  }
});
