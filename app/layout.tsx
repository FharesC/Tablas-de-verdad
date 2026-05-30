import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Generador de Tablas de Verdad',
  description: 'Construye fórmulas lógicas y genera tablas de verdad automáticamente',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/table32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/table.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/table.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/table.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
