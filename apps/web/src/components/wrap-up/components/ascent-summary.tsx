import { displayGrade } from '@/helpers/display-grade'
import { filterAscents } from '@/helpers/filter-ascents'
import { getAverageGrade } from '@/helpers/get-average-grade'
import { sortByDate } from '@/helpers/sort-by-date'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { AscentComponent } from '../../ascent-component/ascent-component'
import { AscentsWithPopover } from '../../ascents-with-popover/ascents-with-popover'
import { Card } from '../../card/card'

export function AscentSummary({
  ascents,
}: {
  ascents: Ascent[]
}) {
  const mostRecentAscent = ascents.toSorted((a, b) => sortByDate(a, b))[0]

  if (ascents.length === 0 || mostRecentAscent === undefined) return undefined

  const onsightAscents = filterAscents(ascents, {
    style: 'Onsight',
  })
  const flashAscents = filterAscents(ascents, { style: 'Flash' })
  const redpointAscents = filterAscents(ascents, {
    style: 'Redpoint',
  })

  const boulders = filterAscents(ascents, { discipline: 'Boulder' })
  const routes = filterAscents(ascents, { discipline: 'Route' })

  const averageRouteGrade = getAverageGrade(routes)
  const averageBoulderGrade = getAverageGrade(boulders)

  return (
    <Card>
      <h2>Ascents</h2>
      <p>
        Your last {mostRecentAscent.discipline.toLowerCase()} was{' '}
        <AscentComponent ascent={mostRecentAscent} showGrade={true} />
      </p>

      {onsightAscents.length === 0 ? undefined : (
        <p>
          You <i>Onsighted</i> <AscentsWithPopover ascents={onsightAscents} />
        </p>
      )}
      {flashAscents.length === 0 ? undefined : (
        <p>
          You <i>Flashed</i> <AscentsWithPopover ascents={flashAscents} />
        </p>
      )}
      {redpointAscents.length === 0 ? undefined : (
        <p>
          You <i>Redpointed</i> <AscentsWithPopover ascents={redpointAscents} />
        </p>
      )}

      {averageRouteGrade === 'N/A' ? undefined : (
        <p>
          Your average route grade was <strong>{averageRouteGrade}</strong>
        </p>
      )}
      {averageBoulderGrade === 'N/A' ? undefined : (
        <p>
          Your average bouldering grade was{' '}
          <strong>
            {displayGrade({
              grade: averageBoulderGrade,
              discipline: 'Boulder',
            })}
          </strong>
        </p>
      )}
    </Card>
  )
}
