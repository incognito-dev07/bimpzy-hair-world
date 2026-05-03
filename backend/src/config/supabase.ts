import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.DATABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});