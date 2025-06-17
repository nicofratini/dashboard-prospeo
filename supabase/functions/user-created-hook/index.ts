import { createClient } from 'jsr:@supabase/supabase-js@2';

interface RawAppMetaData {
  provider: string;
  providers: string[];
}

interface RequestRecord {
  id: string;
  aud: string;
  role: string;
  email: string;
  phone: string | null;
  raw_app_meta_data: RawAppMetaData;
  raw_user_meta_data: Record<string, unknown>;
}

interface RequestModel {
  type: string;
  table: string;
  record: RequestRecord;
  schema: string;
  old_record: RequestRecord | null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 });
  }

  const payload: RequestModel = await req.json();

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
    );

    console.log('upserting profile for user: ', payload.record.id);
    const { data, error } = await supabase.from('profiles').upsert({
      email: payload.record.email,
      user_id: payload.record.id,
    }, {
      onConflict: ['email'],
    }).select();

    if (error) {
      console.error(error.message);
      return new Response(String(error?.message ?? error), { status: 500 });
    }

    console.log('profile upserted for user: ', payload.record.id);

    return new Response(JSON.stringify({ data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  }
  catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 });
  }
});
