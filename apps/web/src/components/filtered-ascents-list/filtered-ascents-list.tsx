import { useAscentsFilter } from '@/hooks/use-ascents-filter'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { AscentList } from '../ascent-list/ascent-list'
import AscentsFilterBar from '../ascents-filter-bar/ascents-filter-bar'

export function FilteredAscentList({ ascents }: { ascents: Ascent[] }) {
  const filteredAscents = useAscentsFilter(ascents ?? [])

  if (!filteredAscents) {
    return <span>No ascents found</span>
  }

  return (
    <section className="flex flex-column gap grid-full-width">
      <AscentsFilterBar allAscents={ascents} />
      <AscentList ascents={filteredAscents} />
    </section>
  )
}
