import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

export const getAllergiesProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from("allergies")
    .select("*")
    .eq("user_id", ctx.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching allergies:", error);
    throw new Error("Failed to fetch allergies");
  }

  return data;
});
