import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const updateEmergencyContactSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  relationship: z.string().optional(),
  phone_number: z.string().optional(),
  email: z.string().optional(),
  is_primary: z.boolean().optional(),
});

export const updateEmergencyContactProcedure = protectedProcedure
  .input(updateEmergencyContactSchema)
  .mutation(async ({ ctx, input }) => {
    const { id, ...updateData } = input;

    const { data, error } = await supabaseServer
      .from("emergency_contacts")
      // @ts-expect-error - Supabase type inference issue
      .update(updateData)
      .eq("id", id)
      .eq("user_id", ctx.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating emergency contact:", error);
      throw new Error("Failed to update emergency contact");
    }

    return data;
  });
