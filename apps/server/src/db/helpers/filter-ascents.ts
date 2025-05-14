import type { OptionalAscentFilter } from '@/contracts/ascents'
import { db } from '@/db'
import { ascent } from '@/db/schema/ascent'
import { type SQL, and, eq } from 'drizzle-orm'

export async function filterAscents(options: OptionalAscentFilter) {
  const {
    crag,
    discipline,
    height,
    holds,
    profile,
    style,
    topoGrade,
    tries,
    year,
    rating,
  } = options ?? {}

  const filters: SQL[] = []

  if (crag !== undefined) filters.push(eq(ascent.crag, crag))
  if (discipline !== undefined) filters.push(eq(ascent.discipline, discipline))
  if (height != null) filters.push(eq(ascent.height, height))
  if (holds != null) filters.push(eq(ascent.holds, holds))
  if (profile != null) filters.push(eq(ascent.profile, profile))
  if (style !== undefined) filters.push(eq(ascent.style, style))
  if (topoGrade !== undefined) filters.push(eq(ascent.topoGrade, topoGrade))
  if (tries !== undefined) filters.push(eq(ascent.tries, tries))
  if (rating != null) filters.push(eq(ascent.rating, rating))

  const filteredAscents = await db
    .select()
    .from(ascent)
    .where(and(...filters))

  return filteredAscents.filter(ascent =>
    year === undefined ? true : ascent.date.getFullYear() === year,
  )
}
