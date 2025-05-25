import { type SQL, and, eq, like } from 'drizzle-orm'
import { db } from '../../index'
import {
  type Ascent,
  type AscentInsert,
  type AscentQueryParams,
  type OptionalAscentFilter,
  ascentTable,
} from '../schema/ascent'

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

  if (crag != null) filters.push(eq(ascentTable.crag, crag))
  if (discipline != null) filters.push(eq(ascentTable.discipline, discipline))
  if (height != null) filters.push(eq(ascentTable.height, height))
  if (holds != null) filters.push(eq(ascentTable.holds, holds))
  if (profile != null) filters.push(eq(ascentTable.profile, profile))
  if (style != null) filters.push(eq(ascentTable.style, style))
  if (topoGrade != null) filters.push(eq(ascentTable.topoGrade, topoGrade))
  if (tries != null) filters.push(eq(ascentTable.tries, tries))
  if (rating != null) filters.push(eq(ascentTable.rating, rating))

  const filteredAscents = await db
    .select()
    .from(ascentTable)
    .where(and(...filters))

  return year == null
    ? filteredAscents
    : filteredAscents.filter(
        ascent => new Date(ascent.date).getFullYear() === year,
      )
}

export async function insertAscent(...newAscent: AscentInsert[]) {
  return await db.insert(ascentTable).values(newAscent).returning()
}

export async function getAscentById(id: Ascent['id']) {
  return await db.select().from(ascentTable).where(eq(ascentTable.id, id))
}

export async function searchAscents({ limit, query }: AscentQueryParams) {
  return await db
    .select()
    .from(ascentTable)
    .where(like(ascentTable.routeName, `%${query}%`))
    .limit(limit)
}
