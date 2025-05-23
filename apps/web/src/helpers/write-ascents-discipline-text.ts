import type { Ascent } from '@repo/db-schema/schema/ascent'

type ClimbingActivity =
  `${Lowercase<Ascent['discipline']> | 'ascent'}${'s' | ''}`

/**
 * Generates a text for ascents based on their climbing discipline.
 *
 * - If there are no ascents, returns "ascents".
 * - If ascents have mixed disciplines, returns "ascent" (if one ascent) or
 *   "ascents" (if more than one).
 * - If all ascents share the same discipline, returns the discipline in
 *   lowercase with no trailing "s" if there is a single ascent,
 *   or with an "s" if there are multiple ascents.
 *
 * @param {Ascent[]} ascents - The list of ascent objects.
 * @returns {ClimbingActivity} The text for the ascents ('boulder', 'boulders',
 * 'route', etc).
 */
export function writeAscentsDisciplineText<
  T extends Pick<Ascent, 'discipline'>,
>(ascents: T[]): ClimbingActivity {
  if (ascents[0] === undefined) return 'ascents'

  const maybePlural = ascents.length > 1 ? 's' : ''

  const firstDiscipline = ascents[0].discipline

  for (const { discipline } of ascents) {
    if (discipline !== firstDiscipline) return `ascent${maybePlural}`
  }

  return `${firstDiscipline.toLowerCase()}${maybePlural}` as ClimbingActivity
}
