import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

export const getEmergencyContactsProcedure = protectedProcedure.query(async ({ ctx }) => {
  const { data, error } = await supabaseServer
    .from("emergency_contacts")
    .select("*")
    .eq("user_id", ctx.user.id)
    .order("is_primary", { ascending: false });

  if (error) {
    console.error("Error fetching emergency contacts:", error);
    throw new Error("Failed to fetch emergency contacts");
  }

  return data;
});
