import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MovieHub Streaming',
    short_name: 'MovieHub',
    description: 'Discover the Series Streaming Experience with Absolutely No Ads',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D0D0F',
    theme_color: '#D4FF3E',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
