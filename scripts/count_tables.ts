import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function count(table: string) {
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
  if (error) {
    console.error(`Error counting ${table}:`, error.message);
    return null;
  }
  return count;
}

async function main() {
  const tables = ['products', 'categories', 'brands', 'product_variants'];
  for (const t of tables) {
    const c = await count(t);
    console.log(`${t}: ${c}`);
  }
}

main();
