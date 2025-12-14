import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  return createClient(
    process.env.SUPABASE_URL!,          // НЕ public емес
    process.env.SUPABASE_SERVICE_ROLE!  // ҚАУІПСІЗ server key
  );
}
