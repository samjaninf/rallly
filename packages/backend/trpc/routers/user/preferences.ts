import z from "zod";

import { publicProcedure, router } from "../../trpc";

const UserPreferencesSchema = z.object({
  language: z.string(),
  timeFormat: z.enum(["12h", "24h"]),
  weekStart: z.number(),
  preferredTimeZone: z.string(),
});

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

export const preferences = router({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.user.preferences ?? {};
  }),
  update: publicProcedure
    .input(UserPreferencesSchema.partial())
    .mutation(async ({ ctx, input: newValues }) => {
      ctx.session.user = {
        ...ctx.user,
        preferences: { ...ctx.user.preferences, ...newValues },
      };
      await ctx.session.save();
    }),
  reset: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.user = {
      ...ctx.user,
      preferences: {},
    };
    await ctx.session.save();
  }),
});
