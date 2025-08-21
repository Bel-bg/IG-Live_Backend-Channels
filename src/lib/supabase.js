const { createClient } = require('@supabase/supabase-js');

// Créer un client Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

module.exports = supabase;