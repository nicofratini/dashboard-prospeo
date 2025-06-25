import { createBaseTemplate, baseStyles } from './base-styles.ts';

export function magicLinkTemplate(
  baseUrl: string,
  tokenHash: string,
  emailActionType: string,
  redirectTo: string,
): string {
  const content = `
    <h1 style="${baseStyles.headingLarge}">
      🪄Your magic link
    </h1>
    <div style="${baseStyles.buttonContainer}">
      <a href="${baseUrl}/api/auth/confirm?token_hash=${tokenHash}&type=${emailActionType}&redirect_to=${redirectTo}" 
         target="_blank" 
         style="${baseStyles.buttonSmall}">
        Click here to sign in
      </a>
    </div>
    <p style="${baseStyles.text}">
      If you didn't try to login, you can safely ignore this email.
    </p>
    <p style="${baseStyles.text}">
      Best,<br>
      - Prospimmo Team
    </p>
    <hr style="${baseStyles.hr}">
    <p style="${baseStyles.footer}">
      <a href="${baseUrl}" target="_blank" style="${baseStyles.link}">
        Prospimmo
      </a>, the ultimate conversational agent.
    </p>
  `;

  return createBaseTemplate('Log in with this magic link', content);
}
