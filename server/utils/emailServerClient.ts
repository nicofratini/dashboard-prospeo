import { Resend, type CreateEmailOptions } from 'resend';
import type { H3Event } from 'h3';

export const emailServerClient = (event: H3Event) => {
  const { resendApiKey } = useRuntimeConfig(event);

  if (!resendApiKey) {
    console.warn('no resendApiKey given for server service');
    throw new Error('Missing `Resend API Key` in `.env`');
  }

  const resend = new Resend(resendApiKey);

  /**
   * Sends an email using the Resend service
   * @param options Email configuration options
   * @returns Promise resolving to the send result
   */
  const sendEmail = (options: CreateEmailOptions) => {
    try {
      return resend.emails.send(options);
    }
    catch (error) {
      console.error('Failed to send email:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to send email',
      });
    }
  };

  /**
   * Adds a contact to the Resend audience
   * @param email Contact's email address
   * @param firstName Optional first name of the contact
   * @param audienceId Optional custom audience ID (defaults to config value)
   * @returns Promise resolving to the add contact result
   */
  const addContact = (email: string, firstName?: string, audienceId?: string) => {
    try {
      return resend.contacts.create({
        email,
        firstName,
        unsubscribed: false,
        audienceId: audienceId || useRuntimeConfig().mailing.resendAudienceId,
      });
    }
    catch (error) {
      console.error('Failed to add contact:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to add contact to mailing list',
      });
    }
  };

  return {
    sendEmail,
    addContact,
  };
};
