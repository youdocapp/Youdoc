import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const updateMedicationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  // Frontend fields
  medication_type: z.string().optional(),
  dosage_amount: z.union([z.number(), z.string()]).optional(),
  dosage_unit: z.string().optional(),
  reminder_times: z.array(z.string()).optional(),
  // Backend fields
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  time: z.array(z.string()).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional().nullable(),
  notes: z.string().optional(),
  reminder_enabled: z.boolean().optional(),
  taken: z.boolean().optional(),
});

export const updateMedicationProcedure = protectedProcedure
  .input(updateMedicationSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;
    const dbUpdateData: any = { ...updateData };

    // 1. Normalize Frequency
    if (updateData.frequency) {
      let freq = updateData.frequency.toLowerCase();
      if (freq === 'as needed') freq = 'as_needed';
      if (['daily', 'weekly', 'as_needed', 'custom'].includes(freq)) {
        dbUpdateData.frequency = freq;
      }
    }

    // 2. Normalize Dosage
    if (updateData.dosage_amount && updateData.dosage_unit) {
      dbUpdateData.dosage = `${updateData.dosage_amount}${updateData.dosage_unit}`;
    }

    // 3. Normalize Time
    if (updateData.reminder_times) {
      dbUpdateData.time = updateData.reminder_times;
    }

    // 4. Handle Medication Type
    if (updateData.medication_type) {
        // Append to notes if existing notes provided, or just set it
        // Note: This overrides notes slightly, but better than losing type info. 
        // Ideally we'd fetch first, but optimizing for one query here:
        const existingNotes = updateData.notes || "";
        dbUpdateData.notes = `[Type: ${updateData.medication_type}] ${existingNotes}`.trim();
    }
    
    // Cleanup frontend keys valid in schema but not DB
    delete dbUpdateData.medication_type;
    delete dbUpdateData.dosage_amount;
    delete dbUpdateData.dosage_unit;
    delete dbUpdateData.reminder_times;

    const { data, error } = await supabaseServer
      .from("medications")
      // @ts-expect-error - Supabase type inference issue
      .update(dbUpdateData)
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
