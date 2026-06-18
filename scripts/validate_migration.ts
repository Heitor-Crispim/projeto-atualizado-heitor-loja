import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

console.log('Validating Migration...');
console.log('Target URL:', supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCount(table: string): Promise<number | null> {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
    
  if (error) {
    console.error(`- ${table}: Error counting:`, error.message);
    return null;
  }
  return count;
}

async function main() {
  const expectations = {
    products: 40,
    categories: 19,
    brands: 8,
    product_variants: 460,
    product_images: 20,
  };

  let allOk = true;

  console.log('Checking counts in target database...');
  for (const [table, expected] of Object.entries(expectations)) {
    const actual = await checkCount(table);
    if (actual === expected) {
      console.log(`[OK] - ${table}: ${actual} (Expected: ${expected})`);
    } else {
      console.error(`[FAIL] - ${table}: ${actual} (Expected: ${expected})`);
      allOk = false;
    }
  }

  // Also check site settings count
  const actualSettings = await checkCount('site_settings');
  console.log(`[INFO] - site_settings: ${actualSettings} (Expected: 1)`);

  if (allOk) {
    console.log('\nSUCCESS: All database row counts match expectations perfectly!');
    process.exit(0);
  } else {
    console.error('\nFAILURE: Some database row counts do not match expectations.');
    process.exit(1);
  }
}

main().catch(console.error);
