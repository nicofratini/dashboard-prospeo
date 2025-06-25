export const baseStyles = {
  body: `margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;`,
  container: `max-width: 600px; margin: 0 auto; padding: 20px;`,
  heading: `color: #1f2937; font-weight: bold; font-size: 24px; margin: 24px 0;`,
  headingLarge: `color: #1f2937; font-weight: bold; font-size: 24px; margin: 40px 0;`,
  text: `color: #6b7280; margin: 12px 0 16px;`,
  button: `display: inline-block; width: 300px; padding: 12px 20px; border-radius: 8px; font-weight: 500; background-color: #000000; color: #ffffff; text-decoration: none; text-align: center;`,
  buttonSmall: `display: inline-block; width: 250px; padding: 12px 20px; border-radius: 8px; font-weight: 500; background-color: #000000; color: #ffffff; text-decoration: none; text-align: center;`,
  buttonContainer: `text-align: center; margin: 20px 0;`,
  hr: `border: none; border-top: 1px solid #d1d5db; margin: 20px 0;`,
  footer: `color: #4b5563; font-size: 14px; line-height: 1.5; margin: 12px 0 24px;`,
  link: `color: #4b5563; text-decoration: underline;`,
};

export function createBaseTemplate(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="${baseStyles.body}">
  <div style="${baseStyles.container}">
    ${content}
  </div>
</body>
</html>
`;
}
