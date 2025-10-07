import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const addSurgerySchema = z.object({
  name: z.string(),
  date: z.string(),
  hospital: z.string().optional(),
  surgeon: z.string().optional(),
  notes: z.string().optional(),
});

export const addSurgeryProcedure = protectedProcedure
  .input(addSurgerySchema)
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await supabaseServer
      .from("surgeries")
      .insert({
        ...input,
        user_id: ctx.user.id,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Error adding surgery:", error);
      throw new Error("Failed to add surgery");
    }

    return data;
  });
