import { ALL_VALUE } from '@/constants/generic'
import { filterAscents } from '@/helpers/filter-ascents'
import { isValidNumber } from '@edouardmisset/math/is-valid.ts'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { useMemo } from 'react'
import { useAscentsQueryState } from './use-ascents-query-state'

/**
 * Filters the provided ascents based on the following query state parameters:
 * year, discipline, style, crag, and grade.
 *
 * @param {Ascent[]} ascents - The array of ascents to filter.
 * @returns {Ascent[]} The filtered ascents.
 */
export function useAscentsFilter(ascents: Ascent[]): Ascent[] {
  const {
    selectedYear,
    selectedDiscipline,
    selectedStyle,
    selectedCrag,
    selectedGrade,
  } = useAscentsQueryState()

  return useMemo(
    () =>
      filterAscents(ascents, {
        year:
          selectedYear !== ALL_VALUE && isValidNumber(Number(selectedYear))
            ? Number(selectedYear)
            : undefined,
        discipline:
          selectedDiscipline === ALL_VALUE ? undefined : selectedDiscipline,
        style: selectedStyle === ALL_VALUE ? undefined : selectedStyle,
        crag: selectedCrag === ALL_VALUE ? undefined : selectedCrag,
        topoGrade: selectedGrade === ALL_VALUE ? undefined : selectedGrade,
      }),
    [
      ascents,
      selectedCrag,
      selectedDiscipline,
      selectedGrade,
      selectedStyle,
      selectedYear,
    ],
  )
}
