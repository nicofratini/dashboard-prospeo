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
  Tailwind,
  Text,
} from 'npm:@react-email/components@0.0.25';
import * as React from 'npm:react@18.3.1';

interface MagicLinkMailProps {
  base_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
  token: string;
}

export const MagicLinkMail = ({
  base_url,
  email_action_type,
  redirect_to,
  token_hash,
}: MagicLinkMailProps) => (
  <Html>
    <Head />
    <Preview>Log in with this magic link</Preview>
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
            🪄Your magic link
          </Heading>
          <Button
            href={`${base_url}/api/auth/confirm?token_hash=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            target="_blank"
            className="w-3/5 box-border px-5 py-3 rounded-lg font-medium bg-black text-white text-center"
          >
            Click here to sign in
          </Button>
          <Text className="text-gray-500 mt-3 mb-4">
            If you didn&apos;t try to login, you can safely ignore this email.
          </Text>
          <Text className="text-gray-500 mt-3 mb-4">
            Best,
            {' '}
            <br />
            {' '}
            - Nuxtbe Team
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

export default MagicLinkMail;
