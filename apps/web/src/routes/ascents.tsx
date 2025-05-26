import { FilteredAscentList } from '@/components/filtered-ascents-list/filtered-ascents-list'
import GridLayout from '@/components/grid-layout/grid-layout'
import { Loader } from '@/components/loader/loader'
import { sortByDate } from '@/helpers/sort-by-date'
import { client } from '@/utils/orpc'
import { Suspense } from 'react'
import type { Route } from './+types/ascents'

export async function clientLoader({
  params: _params,
}: Route.ClientLoaderArgs) {
  const allAscents = await client.ascents.list()

  return allAscents.toSorted((a, b) => sortByDate(a, b, true))
}

export default function Ascents({ loaderData: ascents }: Route.ComponentProps) {
  return (
    <GridLayout title="Ascents">
      <Suspense fallback={<Loader />}>
        <FilteredAscentList ascents={ascents} />
      </Suspense>
    </GridLayout>
  )
}
