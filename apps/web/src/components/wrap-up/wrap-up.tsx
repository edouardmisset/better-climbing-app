import type { Ascent } from '@repo/db-schema/schema/ascent'
import type { TrainingSession } from '@repo/db-schema/schema/training'
import { Card } from '../card/card'
import GridLayout from '../grid-layout/grid-layout'
import { AscentSummary } from './components/ascent-summary'
import { DaysOutsideSummary } from './components/days-outside-summary'
import { FavoriteCragSummary } from './components/favorite-crag-summary'
import { HardestClimbsSummary } from './components/hardest-climbs-summary'
import { TopTenSummary } from './components/top-ten-summary'
import { VerticalMilestoneSummary } from './components/vertical-milestone-summary'
import { ALL_TIME } from './constants'

export default function WrapUp({
  ascents,
  outdoorSessions,
  year,
}: { ascents?: Ascent[]; year?: number; outdoorSessions?: TrainingSession[] }) {
  if (
    ascents === undefined ||
    outdoorSessions === undefined ||
    ascents.length === 0
  ) {
    return (
      <GridLayout title={year ?? ALL_TIME}>
        <Card>
          <h2>No Data</h2>
          <p>
            You have not logged any data yet. Go climb some routes and train!
          </p>
        </Card>
      </GridLayout>
    )
  }

  return (
    <GridLayout title={year ?? ALL_TIME} gridClassName="padding">
      <DaysOutsideSummary ascents={ascents} outdoorSessions={outdoorSessions} />
      <AscentSummary ascents={ascents} />
      <HardestClimbsSummary ascents={ascents} />
      <VerticalMilestoneSummary ascents={ascents} />
      <FavoriteCragSummary ascents={ascents} />
      <TopTenSummary ascents={ascents} />
    </GridLayout>
  )
}
