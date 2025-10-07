import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

export const getHealthRecordsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from("health_records")
    .select("*")
    .eq("user_id", ctx.user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching health records:", error);
    throw new Error("Failed to fetch health records");
  }

  return data;
});
