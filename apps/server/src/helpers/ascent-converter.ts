import {
  BOULDERING_BONUS_POINTS,
  GRADE_TO_POINTS,
  type Grade,
  STYLE_TO_POINTS,
} from '@repo/db-schema/constants/ascent'
import type { Ascent } from '@repo/db-schema/schema/ascent'

/**
 * Converts a climbing ascent to its corresponding points value.
 *
 * Combines the points defined for the given climbing grade, style, and discipline.
 *
 * @param {Ascent} params - The ascent object containing climb details.
 * @param {Grade} params.topoGrade - The topo grade of the ascent.
 * @param {string} params.style - The style of the ascent.
 * @param {string} params.discipline - The discipline of the climb.
 * @returns {number} The total points for the ascent.
 */
export function fromAscentToPoints({
  topoGrade,
  style,
  discipline,
}: Ascent): number {
  const gradePoints =
    GRADE_TO_POINTS[topoGrade as keyof typeof GRADE_TO_POINTS] ?? 0
  const stylePoints = STYLE_TO_POINTS[style] ?? 0
  const climbingDisciplineBonus =
    discipline === 'Boulder' ? BOULDERING_BONUS_POINTS : 0

  return gradePoints + stylePoints + climbingDisciplineBonus
}

/**
 * Converts a points value to its corresponding climbing grade.
 *
 * *NOTE*: The returned grade is meant to for a **redpoint route** ascent.
 *
 * Looks up the grade that corresponds to the given points value in the
 * GRADE_TO_POINTS mapping.
 * If the points value is not found in the mapping, returns a default grade of
 * DEFAULT_GRADE and logs an error message.
 *
 * @param {number} points - The points value to convert to a grade.
 * @param {Object} [to] - Optional parameters to adjust the conversion.
 * @param {string} [to.discipline='Route'] - The climbing discipline ('Route' or 'Boulder').
 * @param {string} [to.style='Redpoint'] - The climbing style.
 * @returns {Grade} The climbing grade corresponding to the points value, or
 * DEFAULT_GRADE if no match is found.
 */
export function fromPointToGrade(
  points: number,
  to?: Pick<Partial<Ascent>, 'discipline' | 'style'>,
): Grade {
  const { discipline = 'Route', style = 'Redpoint' } = to ?? {}

  const listOfPoints = Object.values(GRADE_TO_POINTS)

  const adjustedPoints = (points -
    (STYLE_TO_POINTS[style] ?? 0) -
    (discipline === 'Boulder'
      ? BOULDERING_BONUS_POINTS
      : 0)) as (typeof listOfPoints)[number]

  if (!listOfPoints.includes(adjustedPoints)) {
    globalThis.console.log(
      `Invalid value (${adjustedPoints}). Points should be between ${Math.min(
        ...listOfPoints,
      )} and ${Math.max(...listOfPoints)} in steps of 50 points`,
    )
    return '1a'
  }

  const parsedPoint = adjustedPoints as (typeof listOfPoints)[number]

  const grade = Object.entries(GRADE_TO_POINTS).find(([_, value]) => {
    return value === parsedPoint
  })

  if (!grade) {
    globalThis.console.log(
      `Error: No matching grade found for the given points (${parsedPoint}).`,
    )
    return '1a'
  }

  return grade[0] as Grade
}
