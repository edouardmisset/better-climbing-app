import { getAscentsFromGS } from '@repo/google-sheets/ascent'
import { getTrainingSessionsFromDB as getTrainingSessionsFromGS } from '@repo/google-sheets/training'
import { sql } from 'drizzle-orm'
import { db } from '..'
import { ascentTable } from './schema/ascent'
import { trainingSessionTable } from './schema/training'

/**
 * Configuration options for the seeding process
 */
interface SeedOptions {
  /** Whether to seed ascents data */
  seedAscents: boolean
  /** Whether to seed training sessions data */
  seedTrainingSessions: boolean
  /** Batch size for database inserts */
  batchSize: number
  /** Maximum number of retries for failed operations */
  maxRetries: number
  /** Whether to log verbose information */
  verbose: boolean
}

// Default configuration
const defaultOptions: SeedOptions = {
  seedAscents: true,
  seedTrainingSessions: true,
  batchSize: 500,
  maxRetries: 3,
  verbose: true,
}

/**
 * Logger utility for consistent logging format
 */
class Logger {
  constructor(private verbose: boolean) {}

  info(message: string): void {
    console.info(`[INFO] ${message}`)
  }

  warn(message: string): void {
    console.warn(`[WARNING] ${message}`)
  }

  error(message: string, error?: unknown): void {
    console.error(`[ERROR] ${message}`)
    if (error && this.verbose) {
      console.error(error)
    }
  }

  success(message: string): void {
    console.info(`[SUCCESS] ${message}`)
  }

  debug(message: string): void {
    if (this.verbose) {
      console.debug(`[DEBUG] ${message}`)
    }
  }
}

/**
 * Fetches data from Google Sheets with retry logic
 */
async function fetchDataWithRetry<T>(
  fetchFn: () => Promise<T[]>,
  dataType: string,
  maxRetries: number,
  logger: Logger,
): Promise<T[]> {
  let attempts = 0
  let lastError: unknown

  while (attempts < maxRetries) {
    try {
      logger.info(
        `Fetching ${dataType} data (attempt ${attempts + 1}/${maxRetries})...`,
      )
      const data = await fetchFn()
      logger.success(`Successfully fetched ${data.length} ${dataType} records`)
      return data
    } catch (error) {
      lastError = error
      attempts++
      logger.warn(`Attempt ${attempts}/${maxRetries} failed for ${dataType}`)
      // Simple exponential backoff
      if (attempts < maxRetries) {
        const delay = 1000 * 2 ** (attempts - 1)
        logger.debug(`Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  logger.error(
    `Failed to fetch ${dataType} after ${maxRetries} attempts`,
    lastError,
  )
  return []
}

/**
 * Transforms ascents data from Google Sheets format to database format
 */
function transformAscentsData(
  ascentsData: Awaited<ReturnType<typeof getAscentsFromGS>>,
  logger: Logger,
) {
  logger.info(`Transforming ${ascentsData.length} ascents...`)

  return ascentsData.map(ascent => {
    const { discipline, points, id, ...rest } = ascent
    return {
      ...rest,
      discipline,
      points: points ?? fromAscentToPoints(ascent),
    }
  })
}

/**
 * Transforms training sessions data from Google Sheets format to database format
 */
function transformTrainingSessionsData(
  trainingData: Awaited<ReturnType<typeof getTrainingSessionsFromGS>>,
  logger: Logger,
) {
  logger.info(`Transforming ${trainingData.length} training sessions...`)

  return trainingData.map(
    ({ id, discipline, sessionType, gymCrag, ...rest }) => ({
      discipline,
      location: gymCrag,
      type: sessionType,
      ...rest,
    }),
  )
}

/**
 * Executes database operations in a transaction with error handling
 */
async function executeDbOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  logger: Logger,
): Promise<T | null> {
  try {
    logger.debug(`Executing database operation: ${operationName}`)
    return await operation()
  } catch (error) {
    logger.error(`Database operation failed: ${operationName}`, error)
    return null
  }
}

/**
 * Main seeding function
 */
async function seedDatabase(
  options: SeedOptions = defaultOptions,
): Promise<void> {
  const logger = new Logger(options.verbose)
  logger.info('Starting database seeding process...')

  let ascentsData: Awaited<ReturnType<typeof getAscentsFromGS>> = []
  let trainingsData: Awaited<ReturnType<typeof getTrainingSessionsFromGS>> = []

  // Fetch data in parallel for better performance
  const fetchPromises: Promise<void>[] = []

  if (options.seedAscents) {
    fetchPromises.push(
      fetchDataWithRetry(
        getAscentsFromGS,
        'ascents',
        options.maxRetries,
        logger,
      ).then(data => {
        ascentsData = data
      }),
    )
  }

  if (options.seedTrainingSessions) {
    fetchPromises.push(
      fetchDataWithRetry(
        getTrainingSessionsFromGS,
        'training sessions',
        options.maxRetries,
        logger,
      ).then(data => {
        trainingsData = data
      }),
    )
  }

  try {
    await Promise.all(fetchPromises)
  } catch (error) {
    logger.error('Failed to fetch data from Google Sheets', error)
    return
  }

  // Validate data before proceeding
  if (options.seedAscents && ascentsData.length === 0) {
    logger.error('No ascent data was fetched. Aborting database seeding.')
    return
  }

  if (options.seedTrainingSessions && trainingsData.length === 0) {
    logger.error(
      'No training session data was fetched. Aborting database seeding.',
    )
    return
  }

  // Transform data
  const transformedAscents = options.seedAscents
    ? transformAscentsData(ascentsData, logger)
    : []

  const transformedTrainings = options.seedTrainingSessions
    ? transformTrainingSessionsData(trainingsData, logger)
    : []

  // Execute database operations in a transaction
  try {
    // Start transaction
    await db.transaction(async tx => {
      logger.info('Starting database transaction...')

      // Clear existing data
      if (options.seedAscents) {
        const deletedAscents = await executeDbOperation(
          () => tx.delete(ascentTable),
          'delete existing ascents',
          logger,
        )
        logger.success(
          `Cleared ${deletedAscents?.rows.length} existing ascent data`,
        )
      }

      if (options.seedTrainingSessions) {
        const deletedTrainings = await executeDbOperation(
          () => tx.delete(trainingSessionTable),
          'delete existing training sessions',
          logger,
        )
        logger.success(
          `Cleared ${deletedTrainings?.rows.length} existing training session data`,
        )
      }

      // Insert new data
      if (options.seedAscents && transformedAscents.length > 0) {
        for (let i = 0; i < transformedAscents.length; i += options.batchSize) {
          const batch = transformedAscents.slice(i, i + options.batchSize)
          await executeDbOperation(
            () => tx.insert(ascentTable).values(batch),
            `insert ascents batch ${Math.floor(i / options.batchSize) + 1}`,
            logger,
          )
        }
        logger.success(`Inserted ${transformedAscents.length} ascent records`)
      }

      if (options.seedTrainingSessions && transformedTrainings.length > 0) {
        for (
          let i = 0;
          i < transformedTrainings.length;
          i += options.batchSize
        ) {
          const batch = transformedTrainings.slice(i, i + options.batchSize)
          await executeDbOperation(
            () => tx.insert(trainingSessionTable).values(batch),
            `insert training sessions batch ${Math.floor(i / options.batchSize) + 1}`,
            logger,
          )
        }
        logger.success(
          `Inserted ${transformedTrainings.length} training session records`,
        )
      }

      logger.info('Committing transaction...')
    })

    // Verify counts after transaction
    const ascentCount = options.seedAscents
      ? await db
          .select({ count: sql`count(*)` })
          .from(ascentTable)
          .then(res => Number(res[0]?.count))
      : 0

    const trainingCount = options.seedTrainingSessions
      ? await db
          .select({ count: sql`count(*)` })
          .from(trainingSessionTable)
          .then(res => Number(res[0]?.count))
      : 0

    logger.success('Database seeding completed successfully.')
    logger.info(
      `Final database state: ${ascentCount} ascents, ${trainingCount} training sessions`,
    )
  } catch (error) {
    logger.error('Transaction failed', error)
    logger.error(
      'No changes were made to the database due to transaction failure',
    )
  }
}

// Parse command line arguments
const args = process.argv.slice(2)
const options: SeedOptions = {
  ...defaultOptions,
  seedAscents: !args.includes('--skip-ascents'),
  seedTrainingSessions: !args.includes('--skip-trainings'),
  verbose: !args.includes('--quiet'),
  batchSize: args.includes('--batch-size')
    ? Number.parseInt(args[args.indexOf('--batch-size') + 1]) ||
      defaultOptions.batchSize
    : defaultOptions.batchSize,
}

// Execute the seeding process
await seedDatabase(options)
