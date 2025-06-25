export interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: {
    user: { email: string };
    emailData: {
      token_hash: string;
      redirect_to: string;
      email_action_type: string;
    };
  };
}

export function validateRequest(parsed: any): ValidationResult {
  if (!parsed) {
    return {
      isValid: false,
      error: 'Webhook returned null',
    };
  }

  const {
    user,
    email_data,
  } = parsed;

  if (!user?.email || !email_data?.email_action_type) {
    return {
      isValid: false,
      error: 'Missing required fields: user.email or email_action_type',
    };
  }

  return {
    isValid: true,
    data: {
      user: { email: user.email },
      emailData: {
        token_hash: email_data.token_hash,
        redirect_to: email_data.redirect_to,
        email_action_type: email_data.email_action_type,
      },
    },
  };
}
