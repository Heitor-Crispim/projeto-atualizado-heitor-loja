Verifique se a SUPABASE_SERVICE_ROLE_KEY está sendo utilizada apenas em server functions e código servidor.

Confirme que ela NÃO está sendo enviada para o frontend, navegador ou bundle cliente.

Se houver qualquer exposição da service role para o cliente, corrija imediatamente.
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getProjectInfo() {
  const { data, error } = await supabase.rpc('get_project_id'); // placeholder function
  if (error) {
    console.error('Error fetching project info', error);
    return;
  }
  console.log('Supabase Project ID:', data?.project_id ?? 'unknown');
}

getProjectInfo().then(() => process.exit(0));
