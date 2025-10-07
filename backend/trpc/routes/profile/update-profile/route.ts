import { z } from "zod";
import { protectedProcedure } from "../../../create-context";
import { supabaseServer } from "../../../../lib/supabase-server";

const updateProfileSchema = z.object({
  full_name: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  height_feet: z.number().optional(),
  height_inches: z.number().optional(),
  weight_lbs: z.number().optional(),
  blood_type: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  avatar_url: z.string().optional(),
});

export const updateProfileProcedure = protectedProcedure
  .input(updateProfileSchema)
  .mutation(async ({ ctx, input }) => {
    const { data, error } = await supabaseServer
      .from("profiles")
      .update(input)
      .eq("id", ctx.user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }

    return data;
  });
