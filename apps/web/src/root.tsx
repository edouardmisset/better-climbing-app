import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Loader } from 'lucide-react'
import { Suspense, useCallback, useEffect, useState } from 'react'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router'
import type { Route } from './+types/root'
import { LightDarkSwitch } from './components/light-dark-switch/light-dark-switch'
import { Navigation } from './components/navigation/navigation'
import { ORPCContext, orpc, queryClient } from './utils/orpc'

import '@/styles/sizes.css'
import '@/styles/colors.css'
import '@/styles/animation.css'
import '@/styles/aspects.css'
import '@/styles/border.css'
import '@/styles/button.css'
import '@/styles/durations.css'
import '@/styles/easing.css'
import '@/styles/fonts.css'
import '@/styles/gradients.css'
import '@/styles/shadows.css'
import '@/styles/zindex.css'
import '@/styles/climbing-colors.css'
import '@/styles/reset.css'
import '@/styles/utilities.css'

import styles from './index.module.css'

export const links: Route.LinksFunction = () => [
  {
    rel: 'preconnect',
    href: 'https://fonts.googleapis.com',
  },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  // on mount read local storage or user system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      setTheme(stored)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      return next
    })
  }, [])

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={styles.body}>
        <header className={styles.header}>
          <LightDarkSwitch checked={theme === 'dark'} onChange={toggleTheme} />
          <Navigation />
        </header>
        <main className={styles.main}>
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ORPCContext.Provider value={orpc}>
        <Outlet />
      </ORPCContext.Provider>
      <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
    </QueryClientProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
