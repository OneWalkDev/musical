import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/inter-latin-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-latin-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-latin-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-latin-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/inter-latin-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
})

const notoSansJP = localFont({
  src: [
    {
      path: '../../public/fonts/noto-sans-jp-japanese-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/noto-sans-jp-japanese-500-normal.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/noto-sans-jp-japanese-600-normal.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/noto-sans-jp-japanese-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/noto-sans-jp-japanese-800-normal.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Musical',
  description: '♫音楽交換サイト♫',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} ${notoSansJP.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
