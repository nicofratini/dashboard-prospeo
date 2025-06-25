import { createBaseTemplate, baseStyles } from './base-styles.ts';

export function resetPasswordTemplate(
  baseUrl: string,
  tokenHash: string,
  emailActionType: string,
  redirectTo: string,
): string {
  const content = `
    <h1 style="${baseStyles.headingLarge}">
      Password Reset
    </h1>
    <p style="${baseStyles.text}">
      Hi User,<br><br>
      Someone recently requested a password change for your Prospimmo account. 
      If this was you, you can set a new password here:
    </p>
    <div style="${baseStyles.buttonContainer}">
      <a href="${baseUrl}/api/auth/confirm?token_hash=${tokenHash}&type=${emailActionType}&redirect_to=${redirectTo}" 
         style="${baseStyles.button}">
        Click here to Reset Password
      </a>
    </div>
    <p style="${baseStyles.text}">
      If you don't want to change your password or didn't request this,
      just ignore and delete this message.
    </p>
    <p style="${baseStyles.text}">
      Remember to use a password that is both strong and unique to your
      Prospimmo account.
    </p>
    <hr style="${baseStyles.hr}">
    <p style="${baseStyles.footer}">
      <a href="${baseUrl}" target="_blank" style="${baseStyles.link}">
        Prospimmo
      </a>, the ultimate conversational agent.
    </p>
  `;

  return createBaseTemplate('Reset Password', content);
}
