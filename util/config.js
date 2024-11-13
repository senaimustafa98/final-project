import { config } from 'dotenv-safe';
import postgres from 'postgres';

// Load environment variables
export function setEnvironmentVariables() {
  config();
}

// Define PostgreSQL configuration with environment variables
export const postgresConfig = {
  host: process.env.PGHOST || 'localhost',
  user: process.env.PGUSER || 'workoutapp',
  password: process.env.PGPASSWORD || 'workoutapp',
  database: process.env.PGDATABASE || 'workout_tracker',
  transform: {
    ...postgres.camel,
    undefined: null,
  },
};
