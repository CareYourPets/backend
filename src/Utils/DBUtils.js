import {Pool} from 'pg';

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL || 'postgresql://postgres:password@localhost/dev',
});

export default pool;
