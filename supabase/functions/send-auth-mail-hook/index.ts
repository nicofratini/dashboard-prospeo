import React from 'npm:react@18.3.1';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { ConfirmSignUpMail } from './_templates/confirm-signup.tsx';
import { ResetPasswordMail } from './_templates/reset-password.tsx';
import { MagicLinkMail } from './_templates/magic-link.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string;

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 });
  }

  const payload = await req.text();
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(hookSecret);

  try {
    const {
      user,
      email_data: {
        token,
        token_hash,
        redirect_to,
        email_action_type,
      },
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
        token_new: string;
        token_hash_new: string;
      };
    };

    let emailTemplate;
    switch (email_action_type) {
      case 'recovery':
        emailTemplate = ResetPasswordMail;
        break;
      case 'signup':
        emailTemplate = ConfirmSignUpMail;
        break;
      case 'magiclink':
        emailTemplate = MagicLinkMail;
        break;
      default:
        emailTemplate = ConfirmSignUpMail;
        break;
    }

    let subject;
    switch (email_action_type) {
      case 'recovery':
        subject = 'Reset your password';
        break;
      case 'signup':
        subject = 'Confirm your signup';
        break;
      case 'magiclink':
        subject = 'Login with this magic link';
        break;
      default:
        subject = 'Confirm your signup';
        break;
    }

    const html = await renderAsync(
      React.createElement(emailTemplate, {
        base_url: Deno.env.get('BASE_URL') ?? 'http://localhost:3000',
        token,
        token_hash,
        redirect_to,
        email_action_type,
      }),
    );

    const { error } = await resend.emails.send({
      from: 'Nuxtbe SaaS Starter Kit <noreply@nuxtbe.dev>',
      to: [user.email],
      subject: subject,
      html,
    });
    if (error) {
      throw error;
    }
  }
  catch (error) {
    const err = error as { code: number; message: string };
    console.log(error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: err.code,
          message: err.message,
        },
      }),
      {
        statusText: err.message,
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }

  const responseHeaders = new Headers();
  responseHeaders.set('Content-Type', 'application/json');
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: responseHeaders,
  });
});
