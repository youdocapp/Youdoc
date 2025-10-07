import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const updateMedicationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  dosage: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "as_needed", "custom"]).optional(),
  time: z.array(z.string()).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
  reminder_enabled: z.boolean().optional(),
  taken: z.boolean().optional(),
});

export const updateMedicationProcedure = protectedProcedure
  .input(updateMedicationSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;

    const { data, error } = await supabaseServer
      .from("medications")
      // @ts-expect-error - Supabase type inference issue
      .update(updateData)
      .eq("id", id)
      .eq("user_id", ctx.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating medication:", error);
      throw new Error("Failed to update medication");
    }

    return data;
  });
