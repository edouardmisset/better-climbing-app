import { NOT_AVAILABLE } from '@/constants/generic'
import { average } from '@edouardmisset/math'
import type { Ascent, Grade } from '@repo/db-schema/ascent'
import { fromGradeToNumber, fromNumberToGrade } from './grade-converter'

export function getAverageGrade(
  ascents: Ascent[],
): Grade | typeof NOT_AVAILABLE {
  if (ascents.length === 0) return NOT_AVAILABLE

  const numericGrades = ascents.map(({ topoGrade }) =>
    fromGradeToNumber(topoGrade),
  )
  const avg = average(...numericGrades)
  return fromNumberToGrade(Math.round(avg))
}
