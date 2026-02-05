import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function checkLead() {
  const { data, error } = await supabase
    .from('leads')
    .select('strategy_markdown')
    .eq('id', '6d6ed45d-3d97-422d-ad0b-d578478fe190')
    .single();

  if (error) console.error(error);
  else console.log(data.strategy_markdown);
}

checkLead();
