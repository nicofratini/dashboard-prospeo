import crypto from 'node:crypto';

export default function (key: string, data: string, signature: string) {
  const hmac = crypto.createHmac('sha256', key);
  const digest = Buffer.from(hmac.update(data).digest('hex'), 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');

  if (!crypto.timingSafeEqual(digest, signatureBuf)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid signature!',
    });
  }
}
