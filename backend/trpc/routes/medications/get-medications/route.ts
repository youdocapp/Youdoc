import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

export const getMedicationsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from("medications")
    .select("*")
    .eq("user_id", ctx.user.id)
    .order("date_added", { ascending: false });

  if (error) {
    console.error("Error fetching medications:", error);
    throw new Error("Failed to fetch medications");
  }

  return data;
});
