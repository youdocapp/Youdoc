import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const addMedicalConditionSchema = z.object({
  name: z.string(),
  diagnosed_date: z.string(),
  status: z.enum(["active", "resolved", "chronic"]),
  notes: z.string().optional(),
});

export const addMedicalConditionProcedure = protectedProcedure
  .input(addMedicalConditionSchema)
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await supabaseServer
      .from("medical_conditions")
      .insert({
        ...input,
        user_id: ctx.user.id,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Error adding medical condition:", error);
      throw new Error("Failed to add medical condition");
    }

    return data;
  });
