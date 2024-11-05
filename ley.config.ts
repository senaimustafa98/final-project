import { postgresConfig, setEnvironmentVariables } from './util/config.js';
import postgres from 'postgres';

setEnvironmentVariables();
console.log('Database User:', process.env.PGUSER);

export default {
  connection: postgres({
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    ...postgresConfig,
  }),
};
