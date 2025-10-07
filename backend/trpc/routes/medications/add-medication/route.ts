import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const addMedicationSchema = z.object({
  name: z.string(),
  dosage: z.string(),
  frequency: z.enum(["daily", "weekly", "as_needed", "custom"]),
  time: z.array(z.string()),
  start_date: z.string(),
  end_date: z.string().optional(),
  notes: z.string().optional(),
  reminder_enabled: z.boolean().optional(),
});

export const addMedicationProcedure = protectedProcedure
  .input(addMedicationSchema)
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await (supabaseServer
      .from("medications") as any)
      .insert({
        user_id: ctx.user.id,
        name: input.name,
        dosage: input.dosage,
        frequency: input.frequency,
        time: input.time,
        start_date: input.start_date,
        end_date: input.end_date || null,
        notes: input.notes || null,
        reminder_enabled: input.reminder_enabled ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding medication:", error);
      throw new Error("Failed to add medication");
    }

    return data;
  });
