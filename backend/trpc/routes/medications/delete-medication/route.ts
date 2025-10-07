import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const deleteMedicationSchema = z.object({
  id: z.string(),
});

export const deleteMedicationProcedure = protectedProcedure
  .input(deleteMedicationSchema)
  .mutation(async ({ ctx, input }) => {
    const { error } = await supabaseServer
      .from("medications")
      .delete()
      .eq("id", input.id)
      .eq("user_id", ctx.user.id);

    if (error) {
      console.error("Error deleting medication:", error);
      throw new Error("Failed to delete medication");
    }

    return { success: true };
  });
