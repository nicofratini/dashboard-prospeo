import { createBaseTemplate, baseStyles } from './base-styles.ts';

export function confirmSignUpTemplate(
  baseUrl: string,
  tokenHash: string,
  emailActionType: string,
  redirectTo: string,
): string {
  const content = `
    <h1 style="${baseStyles.heading}">
      Thank you for signing up.
    </h1>
    <p style="${baseStyles.text}">
      Please click on the link below to finish the registration process.
      This link will expire in 15 minutes.
    </p>
    <div style="${baseStyles.buttonContainer}">
      <a href="${baseUrl}/api/auth/confirm?token_hash=${tokenHash}&type=${emailActionType}&redirect_to=${redirectTo}" 
         target="_blank" 
         style="${baseStyles.button}">
        Click here to confirm your mail
      </a>
    </div>
    <p style="${baseStyles.text}">
      If you didn't try to sign up, you can safely ignore this email.
    </p>
    <hr style="${baseStyles.hr}">
    <p style="${baseStyles.footer}">
      <a href="${baseUrl}" target="_blank" style="${baseStyles.link}">
        Prospimmo
      </a>, the ultimate conversational agent.
    </p>
  `;

  return createBaseTemplate('Verify your email address', content);
}
