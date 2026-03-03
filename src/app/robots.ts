import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
            },
            // Explicitly allow AI bots for Generative Engine Optimization (GEO)
            {
                userAgent: ['Googlebot', 'Bingbot', 'PerplexityBot', 'ChatGPT-User', 'ClaudeBot', 'anthropic-ai', 'GPTBot'],
                allow: '/',
            }
        ],
        sitemap: 'https://www.tirionapp.com/sitemap.xml',
    };
}
