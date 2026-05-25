import type { Metadata } from 'next'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Navbar } from '@/components/ui/Navbar'
import './globals.css'

export const metadata: Metadata = {
  title: 'OSINT World Feed',
  description: 'Panel de monitoreo de noticias mundiales en tiempo real con inteligencia de fuentes abiertas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-slate-900 antialiased">
        <AuthProvider>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
