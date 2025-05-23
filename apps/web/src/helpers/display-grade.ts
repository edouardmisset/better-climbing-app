import type { Grade } from '@repo/db-schema/constants/ascent'
import type { Ascent } from '@repo/db-schema/schema/ascent'

/**
 * @param params - The parameters for displaying the grade.
 * @param params.grade - The grade to display.
 * @param params.discipline - The climbing discipline.
 * @returns The formatted grade string.
 */
interface DisplayGradeParams {
  grade: Grade
  discipline: Ascent['discipline']
}

/**
 * Displays the grade based on the climbing discipline.
 * For bouldering, the grade is displayed in uppercase.
 * For other disciplines, the grade is displayed as is.
 *
 * @param params - The parameters for displaying the grade.
 * @returns The formatted grade string.
 */
export function displayGrade(params: DisplayGradeParams): string {
  const { discipline, grade } = params
  return discipline === 'Boulder' ? grade.toUpperCase() : grade
}
