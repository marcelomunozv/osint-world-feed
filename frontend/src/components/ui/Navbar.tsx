'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                OSINT <span className="text-osint-500">Feed</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-osint-600 dark:text-gray-400 dark:hover:text-osint-400 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium text-gray-600 hover:text-osint-600 dark:text-gray-400 dark:hover:text-osint-400 transition-colors"
              >
                Buscar
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/settings"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-osint-600"
                >
                  {user?.name || user?.email}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm px-3 py-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/register"
                  className="text-sm px-4 py-1.5 rounded-lg bg-osint-600 text-white hover:bg-osint-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
