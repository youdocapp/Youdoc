import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const addAllergySchema = z.object({
  allergen: z.string(),
  reaction: z.string(),
  severity: z.enum(["mild", "moderate", "severe"]),
  notes: z.string().optional(),
});

export const addAllergyProcedure = protectedProcedure
  .input(addAllergySchema)
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await supabaseServer
      .from("allergies")
      .insert({
        ...input,
        user_id: ctx.user.id,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Error adding allergy:", error);
      throw new Error("Failed to add allergy");
    }

    return data;
  });
