import { DEFAULT_GRADE } from '@/constants/ascents'
import { isDateInYear } from '@edouardmisset/date'
import { objectKeys, objectSize } from '@edouardmisset/object'
import { stringEqualsCaseInsensitive } from '@edouardmisset/text'
import type { OptionalAscentFilter } from '@repo/db-schema/helpers/ascent'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { frequencyBy } from './frequency-by'
import { fromGradeToNumber } from './grade-converter'

/**
 * Filters the provided ascents based on the given filter criteria.
 *
 * NB: `undefined` is pass through. Meaning that if a filter is `undefined`, no
 * ascents will be filtered out based on that criteria.
 *
 * @param {Ascent[]} ascents - The array of ascents to filter.
 * @param {OptionalAscentFilter} [filters] - An optional set of filter criteria.
 * @returns {Ascent[]} - The filtered array of ascents.
 */
export function filterAscents(
  ascents: Ascent[],
  filters?: OptionalAscentFilter,
): Ascent[] {
  const {
    discipline,
    crag,
    topoGrade,
    height,
    holds,
    profile,
    rating,
    style,
    tries,
    year,
  } = filters ?? {}

  if (!ascents || ascents.length === 0) {
    globalThis.console.log('No ascents passed to filterAscents')
    return []
  }

  return ascents.filter(
    ascent =>
      (topoGrade === undefined ||
        stringEqualsCaseInsensitive(ascent.topoGrade, topoGrade)) &&
      (discipline === undefined || ascent.discipline === discipline) &&
      (year === undefined || isDateInYear(ascent.date, year)) &&
      (style === undefined || ascent.style === style) &&
      (profile === undefined || ascent.profile === profile) &&
      (rating === undefined || ascent.rating === rating) &&
      (height === undefined || ascent.height === height) &&
      (holds === undefined || ascent.holds === holds) &&
      (tries === undefined || ascent.tries === tries) &&
      (crag === undefined || stringEqualsCaseInsensitive(ascent.crag, crag)),
  )
}

export function getHardestAscent(ascents: Ascent[]): Ascent {
  return ascents.reduce(
    (hardestAscent, currentAscent) => {
      const hardestGrade = fromGradeToNumber(hardestAscent.topoGrade)
      const currentGrade = fromGradeToNumber(currentAscent.topoGrade)

      const isCurrentAscentHarder = hardestGrade < currentGrade

      if (isCurrentAscentHarder) return currentAscent

      return hardestAscent
    },
    { topoGrade: DEFAULT_GRADE } as Ascent,
  )
}

export function getCragsDetails(ascents: Ascent[]): {
  numberOfCrags: number
  mostFrequentCrag: string | undefined
  crags: Ascent['crag'][]
} {
  const cragsByFrequency = frequencyBy(ascents, 'crag', { ascending: false })
  const crags = objectKeys(cragsByFrequency)
  const [mostFrequentCrag] = crags

  return {
    numberOfCrags: objectSize(cragsByFrequency),
    mostFrequentCrag,
    crags,
  }
}
