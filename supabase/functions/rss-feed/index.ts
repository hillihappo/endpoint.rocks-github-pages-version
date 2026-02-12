import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const response = await fetch('https://endpoint.rocks/feed/');
    const xml = await response.text();

    // Simple XML parsing for RSS items
    const items: Array<{title: string; link: string; pubDate: string; description: string; image?: string}> = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title>(.*?)<\/title>/)?.[1] || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const desc = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]>/s)?.[1] || itemXml.match(/<description>(.*?)<\/description>/s)?.[1] || '';
      const image = itemXml.match(/<media:content[^>]+url="([^"]+)"/)?.[1] || 
                     itemXml.match(/<enclosure[^>]+url="([^"]+)"/)?.[1] ||
                     desc.match(/<img[^>]+src="([^"]+)"/)?.[1] || undefined;

      // Strip HTML from description
      const cleanDesc = desc.replace(/<[^>]*>/g, '').substring(0, 200);

      items.push({ title, link, pubDate, description: cleanDesc, image });
    }

    return new Response(JSON.stringify(items.slice(0, 6)), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
