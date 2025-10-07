import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const addEmergencyContactSchema = z.object({
  name: z.string(),
  relationship: z.string(),
  phone_number: z.string(),
  email: z.string().optional(),
  is_primary: z.boolean().optional(),
});

export const addEmergencyContactProcedure = protectedProcedure
  .input(addEmergencyContactSchema)
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await supabaseServer
      .from("emergency_contacts")
      .insert({
        ...input,
        user_id: ctx.user.id,
      } as any)
      .select()
      .single();

    if (error) {
      console.error("Error adding emergency contact:", error);
      throw new Error("Failed to add emergency contact");
    }

    return data;
  });
