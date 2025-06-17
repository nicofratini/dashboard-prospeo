import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'npm:@react-email/components@0.0.25';
import * as React from 'npm:react@18.3.1';

interface ResetPasswordMailProps {
  base_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
  token: string;
}

export const ResetPasswordMail = ({
  base_url,
  email_action_type,
  redirect_to,
  token_hash,
}: ResetPasswordMailProps) => (
  <Html>
    <Head />
    <Preview>Reset Password</Preview>
    <Tailwind>
      <Body
        className="bg-white"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, \'Segoe UI\', \'Roboto\', \'Oxygen\', \'Ubuntu\', \'Cantarell\', \'Fira Sans\', \'Droid Sans\', \'Helvetica Neue\', sans-serif',
        }}
      >
        <Container className="px-3 mx-auto">
          <Heading className="text-gray-800 font-bold text-2xl my-10">
            Password Reset
          </Heading>
          <Text className="text-gray-500 mt-3 mb-4">
            Hi User,
            {' '}
            <br />
            {' '}
            Someone recently requested a password change for your
            Nuxtbe account. If this was you, you can set a new password
            here:
          </Text>
          <Section className="flex justify-center items-center w-1/2">
            <Button
              href={`${base_url}/api/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
              className="w-full box-border px-5 py-3 rounded-lg font-medium bg-black text-white text-center"
            >
              Click here to Reset Password
            </Button>
          </Section>
          <Text className="text-gray-500 mt-3 mb-4">
            If you don't want to change your password or didn't request this,
            just ignore and delete this message.
          </Text>
          <Text className="text-gray-500 mt-3 mb-4">
            Remember to use a password that is both strong and unique to your
            Nuxtbe account.
          </Text>
          <Hr className="border-gray-300 my-5" />
          <Text className="text-gray-600 text-sm leading-6 mt-3 mb-6">
            <Link
              href={base_url}
              target="_blank"
              className="text-gray-600 underline"
            >
              Nuxtbe Demo
            </Link>
            , the all-in-one-boilerplate
            <br />
            build your
            {' '}
            <strong>SaaS</strong>
            {' '}
            in days, not
            {' '}
            <strong>months</strong>
            .
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ResetPasswordMail;
