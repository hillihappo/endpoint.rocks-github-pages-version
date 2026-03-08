import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  'https://endpoint.rocks',
  'https://endpoint-sparkle.lovable.app',
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get('origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const migrate = url.searchParams.get('migrate') === 'true';

    const response = await fetch('https://endpoint.rocks/feed/');
    const xml = await response.text();

    const items: Array<{
      title: string;
      link: string;
      pubDate: string;
      description: string;
      content: string;
      image?: string;
      slug: string;
    }> = [];

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || 
                     itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const desc = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]>/s)?.[1] || 
                   itemXml.match(/<description>(.*?)<\/description>/s)?.[1] || '';
      const fullContent = itemXml.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] || desc;
      const image = itemXml.match(/<media:content[^>]+url="([^"]+)"/)?.[1] || 
                     itemXml.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] ||
                     fullContent.match(/<img[^>]+src="([^"]+)"/)?.[1] || undefined;

      const cleanDesc = desc.replace(/<[^>]*>/g, '').substring(0, 200);
      
      const slug = link.replace(/https?:\/\/[^/]+/, '').replace(/\//g, '-').replace(/^-|-$/g, '') || 
                   title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      items.push({ title, link, pubDate, description: cleanDesc, content: fullContent, image, slug });
    }

    if (migrate) {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

      // Use service role to verify user and check admin role
      const adminClient = createClient(supabaseUrl, serviceKey);
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authError } = await adminClient.auth.getUser(token);

      if (authError || !user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check admin role using service role client (has_role is no longer callable by authenticated users)
      const { data: roleData } = await adminClient
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const postsToInsert = items.map(item => ({
        title: item.title.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c))),
        slug: item.slug,
        content: item.content,
        excerpt: item.description,
        image_url: item.image || null,
        published_at: new Date(item.pubDate).toISOString(),
      }));

      const { data, error } = await adminClient
        .from('blog_posts')
        .upsert(postsToInsert, { onConflict: 'slug' })
        .select();

      if (error) throw error;

      return new Response(JSON.stringify({ migrated: data?.length ?? 0, posts: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(items.slice(0, 6).map(({ content, ...rest }) => rest)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('RSS function error:', error);
    const corsHeaders = getCorsHeaders(req);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
