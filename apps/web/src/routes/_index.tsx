import WrapUp from '@/components/wrap-up/wrap-up'
import { orpc } from '@/utils/orpc'
import { useQuery } from '@tanstack/react-query'
import type { Route } from './+types/_index'

export function meta(_params: Route.MetaArgs) {
  return [
    { title: 'Home 🏠' },
    {
      name: 'Textual description of all my climbing ascents',
      content: "My Climbing ascents' description",
    },
  ]
}

export default function Home() {
  const { data: ascents, isLoading: isAscentsLoading } = useQuery(
    orpc.ascents.list.queryOptions(),
  )
  const { data: outdoorSessions, isLoading: isTrainingLoading } = useQuery(
    orpc.trainingSessions.list.queryOptions({
      input: {
        type: 'Out',
      },
    }),
  )

  if (isAscentsLoading || isTrainingLoading) return <div>Loading...</div>

  return <WrapUp ascents={ascents} outdoorSessions={outdoorSessions} />
}
