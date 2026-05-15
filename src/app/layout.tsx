import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BookRight — Booking Platform for Local Businesses',
  description: 'The smart booking platform for local service businesses.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
