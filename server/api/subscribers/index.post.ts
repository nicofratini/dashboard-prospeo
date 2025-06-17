import { object, string } from 'zod';
import { serverSupabaseClient } from '#supabase/server';
import type { Database } from '~~/types/database.types';

const bodySchema = object({
  email: string()
    .email('Invalid email format')
    .min(1, 'Email is required')
    .max(32, 'Email must be less than 32 characters'),
  full_name: string()
    .max(64, 'Name must be less than 64 characters')
    .optional(),
  note: string()
    .max(500, 'Note must be less than 500 characters')
    .optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, bodySchema.parse);
  if (!body) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request body',
    });
  }

  const client = await serverSupabaseClient<Database>(event);
  const { addContact } = emailServerClient(event);

  const { error } = await client.from('newsletters_subscribers')
    .insert([{
      email: body.email,
      full_name: body.full_name,
      note: body.note,
    }]);

  if (error) {
    throw createError({
      statusCode: error.code === '23505' ? 400 : 500,
      message: error.code === '23505'
        ? 'You are already subscribed to our newsletter!'
        : 'Failed to subscribe to newsletter. Please try again later!',
    });
  }

  const { error: resendError } = await addContact(body.email, body.full_name);

  if (resendError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to subscribe to newsletter. Please try again later!',
    });
  }

  return {
    success: true,
    message: 'Successfully subscribed to newsletter',
  };
});
