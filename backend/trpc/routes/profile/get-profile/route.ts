import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

export const getProfileProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from("profiles")
    .select("*")
    .eq("id", ctx.user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }

  return data;
});
