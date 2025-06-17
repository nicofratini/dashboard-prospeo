import { toast } from 'vue-sonner';
import type { AuthError } from '@supabase/auth-js';
import type { PostgrestError } from '@supabase/postgrest-js';
// [TIP] add any other errors you want to handle here.
export default (error: PostgrestError | AuthError, description?: string) => {
  toast.error('Error', {
    description: description || error.message || 'An error occurred. Please try again later.',
    closeButton: true,
  });
};
