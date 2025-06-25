import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';
import { generateEmailHTML } from './utils/email-generator.ts';
import { validateRequest } from './utils/validation.ts';
import { createErrorResponse, createSuccessResponse } from './utils/responses.ts';

Deno.serve(async (req) => {
  console.info('[BOOT] Function invoked');

  try {
    console.info('[REQ] Method:', req.method, 'URL:', req.url);

    if (req.method !== 'POST') {
      console.warn('[WARN] Invalid method');
      return new Response('Method Not Allowed', { status: 405 });
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const HOOK_SECRET = Deno.env.get('SEND_EMAIL_HOOK_SECRET');
    const BASE_URL = Deno.env.get('BASE_URL') ?? 'http://localhost:3000';

    if (!RESEND_API_KEY || !HOOK_SECRET) {
      console.error('[ERROR] Missing RESEND_API_KEY or SEND_EMAIL_HOOK_SECRET');
      throw new Error('Missing required environment variables');
    }

    const resend = new Resend(RESEND_API_KEY);
    const webhook = new Webhook(HOOK_SECRET);

    // Get and verify webhook
    const rawBody = await req.text();
    console.info('[DEBUG] Payload length:', rawBody.length);

    const headers = Object.fromEntries(req.headers);

    let parsed;
    try {
      parsed = webhook.verify(rawBody, headers);
      console.info('[INFO] Webhook verified');
    }
    catch (err) {
      console.error('[ERROR] Webhook verification failed:', err);
      return createErrorResponse('Invalid webhook signature', 403);
    }

    if (!parsed) {
      console.error('[ERROR] Webhook verify returned null');
      throw new Error('Webhook returned null');
    }

    // Validate and extract data
    const validationResult = validateRequest(parsed);
    if (!validationResult.isValid) {
      console.warn('[WARN] Missing payload fields', parsed);
      return createErrorResponse(validationResult.error, 400);
    }

    const { user, emailData } = validationResult.data;

    console.info('[INFO] Payload data:', {
      email: user.email,
      action: emailData.email_action_type,
    });

    const { html, subject } = generateEmailHTML({
      baseUrl: BASE_URL,
      tokenHash: emailData.token_hash,
      emailActionType: emailData.email_action_type,
      redirectTo: emailData.redirect_to,
    });

    console.info('[INFO] Sending email to', user.email);

    const result = await resend.emails.send({
      from: 'Prospeo.ai <contact@info.prospeo.ai>',
      to: [user.email],
      subject,
      html,
    });

    if (!result || result.error) {
      console.error('[ERROR] Resend failed:', result?.error?.message);
      throw new Error(result?.error?.message ?? 'Resend send failed');
    }

    console.info('[SUCCESS] Email sent');
    return createSuccessResponse({ success: true });
  }
  catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    console.error('[EXCEPTION]', msg);
    return createErrorResponse(msg, 500);
  }
});
