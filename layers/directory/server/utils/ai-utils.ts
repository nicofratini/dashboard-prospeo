/**
 * Utilities for working with AI responses
 */

interface ContentAnalysisResult {
  summary: string;
  tags: string[];
  categories: string[];
  primaryTopic: string;
  targetAudience: string;
}

/**
 * Parses the AI response and returns a structured ContentAnalysisResult object.
 *
 * @param responseText - The response text from the AI.
 * @returns A structured ContentAnalysisResult object.
 */
export const parseContentAnalysis = (responseText: string): ContentAnalysisResult => {
  try {
    // Find JSON content in the response - look for content between { and }
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    else {
      // Fallback to parsing the entire response as JSON
      return JSON.parse(responseText);
    }
  }
  catch (parseError) {
    console.error('Error parsing AI response:', parseError);
    // Provide a minimal response if parsing fails
    return {
      summary: 'Failed to generate summary',
      tags: [],
      categories: [],
      primaryTopic: '',
      targetAudience: '',
    };
  }
};

// Define as a constant for better maintainability
const DEFAULT_MAX_CONTENT_LENGTH = 3000;

/**
 * Creates a prompt for an AI to analyze web page content and return structured data.
 *
 * @param url - The URL of the web page.
 * @param title - The title of the web page.
 * @param description - The meta description of the web page.
 * @param mainContent - The main textual content extracted from the page.
 * @param availableTags - A list of predefined tags the AI can choose from.
 * @param availableCategories - A list of predefined categories the AI can choose from.
 * @param maxContentLength - (Optional) The maximum number of characters to use from mainContent. Defaults to 3000.
 * @returns A string prompt designed for an AI model.
 */
export const createContentAnalysisPrompt = (
  url: string,
  title: string,
  description: string,
  mainContent: string,
  availableTags: string[],
  availableCategories: string[],
  maxContentLength: number = DEFAULT_MAX_CONTENT_LENGTH,
): string => {
  // Truncate content safely
  const truncatedContent = mainContent.substring(0, maxContentLength);

  const displayTitle = title || '[No Title Provided]';
  const displayDescription = description || '[No Description Provided]';

  return `
You are an expert content analyst. Analyze the provided web page content and generate a JSON object containing specific details.

--- INPUT CONTENT ---
URL: ${url}
Title: ${displayTitle}
Description: ${displayDescription}
Main Content Preview (up to ${maxContentLength} chars):
${truncatedContent}

--- AVAILABLE OPTIONS ---
Available Tags: ${JSON.stringify(availableTags)}
Available Categories: ${JSON.stringify(availableCategories)}

--- INSTRUCTIONS ---
Carefully review the input content and available options, then provide a JSON object with the following exact keys:

1.  "summary": A concise summary of the main content (maximum 150 words).
2.  "tags": An array containing 1 to 3 of the *most* relevant tags. IMPORTANT: Select ONLY from the 'Available Tags' list provided above. Do NOT create new tags. If no tags from the list are relevant, return an empty array [].
3.  "categories": An array containing 1 to 3 of the *most* relevant categories. IMPORTANT: Select ONLY from the 'Available Categories' list provided above. Do NOT create new categories. If no categories from the list are relevant, return an empty array [].
4.  "primaryTopic": A brief phrase describing the main subject matter of the content.
5.  "targetAudience": A brief description of the likely intended audience for this content.

--- OUTPUT FORMAT ---
Provide *only* a single, valid JSON object in your response. Do not include any text, explanation, or markdown formatting before or after the JSON object.

Example JSON format:
{
  "summary": "A brief overview of the content's main points...",
  "tags": ["tag1", "tag2"],
  "categories": ["categoryA"],
  "primaryTopic": "Example Topic Name",
  "targetAudience": "Example Audience Description"
}
`;
};

export const SYSTEM_MESSAGE = 'You are an expert content analyst. Analyze the provided website content and suggest relevant tags, categories, and a summary.';
