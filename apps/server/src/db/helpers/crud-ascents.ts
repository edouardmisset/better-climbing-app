import type {
  AscentQueryParams,
  OptionalAscentFilter,
} from '@/contracts/ascents'
import { db } from '@/db'
import {
  type AscentInsert,
  type AscentSelect,
  ascent,
} from '@/db/schema/ascent'
import { type SQL, and, eq, like } from 'drizzle-orm'

export async function getFilteredAscents(options: OptionalAscentFilter) {
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

  if (crag != null) filters.push(eq(ascent.crag, crag))
  if (discipline != null) filters.push(eq(ascent.discipline, discipline))
  if (height != null) filters.push(eq(ascent.height, height))
  if (holds != null) filters.push(eq(ascent.holds, holds))
  if (profile != null) filters.push(eq(ascent.profile, profile))
  if (style != null) filters.push(eq(ascent.style, style))
  if (topoGrade != null) filters.push(eq(ascent.topoGrade, topoGrade))
  if (tries != null) filters.push(eq(ascent.tries, tries))
  if (rating != null) filters.push(eq(ascent.rating, rating))

  const filteredAscents = await db
    .select()
    .from(ascent)
    .where(and(...filters))

  return year == null
    ? filteredAscents
    : filteredAscents.filter(
        ascent => new Date(ascent.date).getFullYear() === year,
      )
}

export async function insertAscent(...newAscent: AscentInsert[]) {
  return await db.insert(ascent).values(newAscent).returning()
}

export async function getAscentById(id: AscentSelect['id']) {
  return await db.select().from(ascent).where(eq(ascent.id, id))
}

export async function searchAscents({ limit, query }: AscentQueryParams) {
  return await db
    .select()
    .from(ascent)
    .where(like(ascent.routeName, `%${query}%`))
    .limit(limit)
}
