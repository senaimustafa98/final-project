import type { Sql } from 'postgres';
import postgres from 'postgres';
import { postgresConfig, setEnvironmentVariables } from '../util/config';

// Load environment variables
setEnvironmentVariables();

declare namespace globalThis {
  let postgresSqlClient: Sql;
}

// Connect to the database only once
function connectOneTimeToDatabase() {
  if (!('postgresSqlClient' in globalThis)) {
    globalThis.postgresSqlClient = postgres(postgresConfig);
  }

  return globalThis.postgresSqlClient;
}

// Export the connection to be used throughout the app
export const sql = connectOneTimeToDatabase();
