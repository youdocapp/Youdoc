import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const deleteEmergencyContactSchema = z.object({
  id: z.string(),
});

export const deleteEmergencyContactProcedure = protectedProcedure
  .input(deleteEmergencyContactSchema)
  .mutation(async ({ ctx, input }) => {
    const { error } = await supabaseServer
      .from("emergency_contacts")
      .delete()
      .eq("id", input.id)
      .eq("user_id", ctx.user.id);

    if (error) {
      console.error("Error deleting emergency contact:", error);
      throw new Error("Failed to delete emergency contact");
    }

    return { success: true };
  });
