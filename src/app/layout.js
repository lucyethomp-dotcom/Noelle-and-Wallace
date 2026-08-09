import './globals.css'

const title = 'The Story of Noelle & Wallace'
const description = 'A San Francisco Romance, Delivered Daily'

export const metadata = {
  metadataBase: new URL('https://mywebsoap.com'),
  title,
  description,
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
      <body>{children}</body>
    </html>
  )
}
