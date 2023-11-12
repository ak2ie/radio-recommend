import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { createContext } from 'react'
import Content from './content'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'おすすめラジオ',
  description: 'お好みのラジオ番組をおすすめします',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`gra sm:mx-0 mx-3 ${inter.className}`}>
          <Content>{children}</Content>
      </body>
    </html>
  )
}
