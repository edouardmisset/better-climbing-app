import { type Ascent, ascentSelectSchema } from '@repo/db-schema/schema/ascent'
import { sortByDate } from '@repo/utils/sort-by-date'
import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { loadWorksheet } from './google-sheets'
import {
  transformAscentFromGSToJS,
  transformAscentFromJSToGS,
} from './helpers/transformers'

/**
 * Retrieves all ascent records from the Google Sheets 'ascents' worksheet,
 * transforms them from Google Sheets format to JavaScript object format,
 * and validates them against the ascent schema.
 *
 * @returns A promise that resolves to an array of Ascent objects, each
 * representing a validated ascent record.
 */
export async function getAscentsFromGS(): Promise<Ascent[]> {
  let rows:
    | undefined
    | Awaited<ReturnType<GoogleSpreadsheetWorksheet['getRows']>>

  try {
    const allAscentsSheet = await loadWorksheet('ascents')
    rows = await allAscentsSheet.getRows()
  } catch (error) {
    globalThis.console.error(error)
  }

  if (rows === undefined) return []

  const rawAscents = rows.map((row, index) =>
    Object.assign(transformAscentFromGSToJS(row.toObject()), { id: index }),
  )

  const parsedAscents = ascentSelectSchema.array().safeParse(rawAscents)

  if (!parsedAscents.success) {
    globalThis.console.error(parsedAscents.error)
    return []
  }
  return parsedAscents.data.sort((a, b) =>
    // If the dates are the same, we reverse the order because there is no
    // information about the time of the ascent in the Google Sheets. By
    // default, they are stored chronologically (oldest first), so we need to
    // reverse the order to have the most recent first.
    a.date === b.date ? -1 : sortByDate(a, b, true),
  )
}

export async function addAscent(ascent: Omit<Ascent, 'id'>): Promise<void> {
  const manualAscentsSheet = await loadWorksheet('ascents', { edit: true })

  await manualAscentsSheet.addRow(transformAscentFromJSToGS(ascent))
}
