import { config } from 'dotenv-safe';
import postgres from 'postgres';

// Define PostgreSQL configuration
export const postgresConfig = {
  ssl: Boolean(process.env.POSTGRES_URL),
  transform: {
    ...postgres.camel,
    undefined: null,
  },
};

// Function to set environment variables
export function setEnvironmentVariables() {
  if (process.env.NODE_ENV === 'production' || process.env.CI) {
    if (process.env.POSTGRES_URL) {
      process.env.PGHOST = process.env.POSTGRES_HOST;
      process.env.PGDATABASE = process.env.POSTGRES_DATABASE;
      process.env.PGUSER = process.env.POSTGRES_USER;
      process.env.PGPASSWORD = process.env.POSTGRES_PASSWORD;
    }
    return;
  }
  // Load .env for development
  config();
}
