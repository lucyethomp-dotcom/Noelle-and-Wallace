import Script from 'next/script'
import './globals.css'

const GA_MEASUREMENT_ID = 'G-YKWSE4HS32'

const title = 'The Story of Noelle & Wallace'
const description = 'A San Francisco Romance, Delivered Daily'
const longDescription =
  'Follow the evolving relationship between Noelle Thompson, a brilliant tech executive, and Wallace Brown, a quantum physicist, as their paths cross in foggy San Francisco. A free daily serial romance, new episodes published every day at 7 AM PST.'

export const metadata = {
  metadataBase: new URL('https://mywebsoap.com'),
  title,
  description: longDescription,
  keywords: [
    'serial fiction',
    'daily romance story',
    'web novel',
    'San Francisco romance',
    'free online fiction',
    'Noelle and Wallace',
    'MyWebSoap',
  ],
  authors: [{ name: 'Lucy Thompson' }],
  category: 'Fiction',
  alternates: {
    canonical: 'https://mywebsoap.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title,
    description,
    url: 'https://mywebsoap.com',
    siteName: title,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyWebSoap.com',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
