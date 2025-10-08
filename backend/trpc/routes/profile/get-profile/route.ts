import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";
import type { Database } from "../../../../database/types";

type Profile = Database['public']['Tables']['profiles']['Row'];

export const getProfileProcedure = protectedProcedure.query(async ({ ctx }): Promise<Profile> => {
  const { data, error } = await (supabaseServer
    .from("profiles") as any)
    .select("*")
    .eq("id", ctx.user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }

  return data as Profile;
});
