import { JWT } from 'google-auth-library'
import {
  GoogleSpreadsheet,
  type GoogleSpreadsheetWorksheet,
} from 'google-spreadsheet'

const { env } = process

export const SHEETS_INFO = {
  ascents: {
    id: env.GOOGLE_SHEET_ID_ASCENTS,
    sheetTitle: env.GOOGLE_SHEET_ASCENTS_SHEET_TITLE,
    editSheetTitle: env.GOOGLE_SHEET_ASCENTS_EDIT_SHEET_TITLE,
    csvExportURL: env.GOOGLE_SHEET_ASCENTS_URL_CSV,
  },
  training: {
    id: env.GOOGLE_SHEET_ID_TRAINING,
    sheetTitle: env.GOOGLE_SHEET_TRAINING_SHEET_TITLE,
    editSheetTitle: env.GOOGLE_SHEET_TRAINING_EDIT_SHEET_TITLE,
    csvExportURL: env.GOOGLE_SHEET_TRAINING_URL_CSV,
  },
} as const

const serviceAccountAuth = new JWT({
  email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: env.GOOGLE_PRIVATE_KEY?.split(String.raw`\n`)?.join('\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

export const loadWorksheet = async (
  climbingDataType: keyof typeof SHEETS_INFO,
  options?: { edit?: boolean },
): Promise<GoogleSpreadsheetWorksheet> => {
  const {
    id = '',
    sheetTitle = '',
    editSheetTitle = '',
  } = SHEETS_INFO[climbingDataType]
  const { edit = false } = options ?? {}

  const sheet = new GoogleSpreadsheet(id, serviceAccountAuth)
  await sheet.loadInfo()

  const title = edit ? editSheetTitle : sheetTitle
  const worksheet = sheet.sheetsByTitle?.[title]

  if (!worksheet) {
    throw new Error(`Sheet "${title}" not found`)
  }

  return worksheet
}
