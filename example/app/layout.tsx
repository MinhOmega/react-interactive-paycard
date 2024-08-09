import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'React Interactive Paycard',
  description: 'React Interactive Pay Card for ReactJS, NextJS App Router',
  keywords: [
    'react',
    'reactjs',
    'nextjs',
    'form',
    'credit',
    'credit-card',
    'animation',
    'typescript',
    'react-interactive-paycard',
    'react-animation',
    'react-css-transition-group',
    'react-credit-card',
    'react-animated-css',
  ],
  authors: [
    {
      name: 'Vo Ngoc Quang Minh',
      url: 'https://github.com/MinhOmega',
    },
  ],
  openGraph: {
    title: 'React Interactive Paycard',
    description: 'React Interactive Pay Card for ReactJS, NextJS App Router',
    url: 'https://github.com/MinhOmega/react-interactive-paycard#readme',
    siteName: 'React Interactive Paycard',
    images: [
      {
        url: '', // TODO
        width: 800,
        height: 600,
        alt: 'React Interactive Paycard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React Interactive Paycard',
    description: 'React Interactive Pay Card for ReactJS, NextJS App Router',
    images: [''], // TODO
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
