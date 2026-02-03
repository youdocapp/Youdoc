import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const addMedicationSchema = z.object({
  name: z.string(),
  // Frontend fields
  medication_type: z.string().optional(),
  dosage_amount: z.union([z.number(), z.string()]).optional(),
  dosage_unit: z.string().optional(),
  reminder_times: z.array(z.string()).optional(),
  // Backend/DB fields (fallback)
  dosage: z.string().optional(),
  frequency: z.string(), // Accept any string, we'll normalize it
  time: z.array(z.string()).optional(),
  start_date: z.string(),
  end_date: z.string().nullable().optional(), // Allow nullable from frontend
  notes: z.string().optional(),
  reminder_enabled: z.boolean().optional(),
});

export const addMedicationProcedure = protectedProcedure
  .input(addMedicationSchema)
  .mutation(async ({ ctx, input }) => {
    // 1. Normalize Frequency
    let frequency = input.frequency.toLowerCase();
    if (frequency === 'as needed') frequency = 'as_needed';
    // Ensure it matches DB constraint: 'daily', 'weekly', 'as_needed', 'custom'
    if (!['daily', 'weekly', 'as_needed', 'custom'].includes(frequency)) {
       // Default fallback or 'custom' if unknown
       frequency = 'daily'; 
    }

    // 2. Normalize Dosage
    let dosage = input.dosage || "";
    if (!dosage && input.dosage_amount && input.dosage_unit) {
      dosage = `${input.dosage_amount}${input.dosage_unit}`;
    }
    if (!dosage) dosage = "N/A";

    // 3. Normalize Time
    const time = input.time || input.reminder_times || [];

    // 4. Handle Medication Type (Store in notes as we lack a column)
    let notes = input.notes || "";
    if (input.medication_type) {
      notes = `[Type: ${input.medication_type}] ${notes}`.trim();
    }

    const { data, error } = await (supabaseServer
      .from("medications") as any)
      .insert({
        user_id: ctx.user.id,
        name: input.name,
        dosage: dosage,
        frequency: frequency,
        time: time,
        start_date: input.start_date,
        end_date: input.end_date || null,
        notes: notes || null,
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
