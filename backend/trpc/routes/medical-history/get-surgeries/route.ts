import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

export const getSurgeriesProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from("surgeries")
    .select("*")
    .eq("user_id", ctx.user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching surgeries:", error);
    throw new Error("Failed to fetch surgeries");
  }

  return data;
});
