import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

export const getMedicalConditionsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from("medical_conditions")
    .select("*")
    .eq("user_id", ctx.user.id)
    .order("diagnosed_date", { ascending: false });

  if (error) {
    console.error("Error fetching medical conditions:", error);
    throw new Error("Failed to fetch medical conditions");
  }

  return data;
});
