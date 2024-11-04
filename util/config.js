import { config } from 'dotenv-safe';
import postgres from 'postgres';

// Define PostgreSQL configuration
export const postgresConfig = {
  ssl: false,
  transform: {
    ...postgres.camel,
    undefined: null,
  },
};

// Function to set environment variables
export function setEnvironmentVariables() {
  config();
}
