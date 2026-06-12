import { createClient } from "@/lib/supabase/server";

export async function requireUser(): Promise<{ email: string } | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getSession();
    const email = data.session?.user?.email;
    if (!email) return null;
    const allowlist = (process.env.ADMIN_EMAIL ?? "mat@matsiems.com").toLowerCase();
    if (email.toLowerCase() !== allowlist) return null;
    return { email };
  } catch {
    return null;
  }
}
