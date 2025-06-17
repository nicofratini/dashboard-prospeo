declare module 'sanitize-html' {
  export interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: {
      [key: string]: string[];
    };
    allowedSchemes?: string[];
    allowedSchemesByTag?: {
      [key: string]: string[];
    };
    allowedSchemesAppliedToAttributes?: string[];
    allowProtocolRelative?: boolean;
    disallowedTagsMode?: 'discard' | 'escape' | 'recursiveEscape';
    allowedClasses?: {
      [key: string]: string[];
    };
    allowedStyles?: {
      [key: string]: {
        [key: string]: RegExp[];
      };
    };
    selfClosing?: string[];
    allowVulnerableTags?: boolean;
    transformTags?: {
      [key: string]: string | ((tagName: string, attribs: { [key: string]: string }) => {
        tagName: string;
        attribs: { [key: string]: string };
      });
    };
    exclusiveFilter?: (frame: {
      tag: string;
      attribs: { [key: string]: string };
      text: string;
      tagPosition: number;
    }) => boolean;
    textFilter?: (text: string, tagName: string) => string;
    nonTextTags?: string[];
    nestingLimit?: number;
    parseStyleAttributes?: boolean;
    allowedIframeHostnames?: string[];
    allowedIframeDomains?: string[];
    allowedScriptHostnames?: string[];
    allowedScriptDomains?: string[];
  }

  function sanitize(html: string, options?: IOptions): string;

  export default sanitize;
} 