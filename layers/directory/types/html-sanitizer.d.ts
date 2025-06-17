declare module 'html-sanitizer' {
  export interface SanitizerOptions {
    allowedTags?: string[];
    allowedAttributes?: {
      [key: string]: string[];
    };
    allowedSchemes?: string[];
    allowedSchemesByTag?: {
      [key: string]: string[];
    };
  }

  export function sanitize(html: string, options?: SanitizerOptions): string;
} 