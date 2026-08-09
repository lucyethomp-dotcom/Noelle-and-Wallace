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
        url: '/noelle.png',
        width: 1024,
        height: 1024,
        alt: 'Noelle Thompson',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/noelle.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
