import { confirmSignUpTemplate } from '../templates/confirm-signup.ts';
import { magicLinkTemplate } from '../templates/magic-link.ts';
import { resetPasswordTemplate } from '../templates/reset-password.ts';

export interface EmailGeneratorParams {
  baseUrl: string;
  tokenHash: string;
  emailActionType: string;
  redirectTo: string;
}

export interface EmailContent {
  html: string;
  subject: string;
}

export function generateEmailHTML(params: EmailGeneratorParams): EmailContent {
  const { baseUrl, tokenHash, emailActionType, redirectTo } = params;

  switch (emailActionType) {
    case 'recovery':
      return {
        html: resetPasswordTemplate(baseUrl, tokenHash, emailActionType, redirectTo),
        subject: 'Reset your password',
      };
    case 'signup':
      return {
        html: confirmSignUpTemplate(baseUrl, tokenHash, emailActionType, redirectTo),
        subject: 'Confirm your signup',
      };
    case 'magiclink':
      return {
        html: magicLinkTemplate(baseUrl, tokenHash, emailActionType, redirectTo),
        subject: 'Login with this magic link',
      };
    default:
      console.warn('[WARN] Unknown action type, defaulting to signup');
      return {
        html: confirmSignUpTemplate(baseUrl, tokenHash, emailActionType, redirectTo),
        subject: 'Confirm your signup',
      };
  }
}
