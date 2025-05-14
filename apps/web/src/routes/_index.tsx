import { orpc } from '@/utils/orpc'
import { useQuery } from '@tanstack/react-query'
import type { Route } from './+types/_index'

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `

export function meta(_params: Route.MetaArgs) {
  return [
    { title: 'My C App' },
    { name: 'description', content: 'My Climbing App' },
  ]
}

export default function Home() {
  const healthCheck = useQuery(orpc.healthCheck.queryOptions())
  const { data: ascents, isLoading } = useQuery(
    orpc.ascents.list.queryOptions(),
  )

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <pre>{TITLE_TEXT}</pre>
      <div>
        <section>
          <h2>API Status</h2>
          <div>
            <span>
              {healthCheck.isLoading
                ? 'Checking...'
                : healthCheck.data
                  ? 'Connected'
                  : 'Disconnected'}
            </span>
            {ascents?.map(ascent => (
              <div key={ascent.id}>
                <h3>{ascent.routeName}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
