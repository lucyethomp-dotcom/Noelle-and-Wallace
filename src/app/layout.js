import './globals.css'

export const metadata = {
  title: 'The Story of Noelle & Wallace',
  description: 'A San Francisco Romance, Delivered Daily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
