// import { v } from "convex/values";
// import { mutation } from "./_generated/server";

// export const CreateUser = mutation({
//   args: {
//     name: v.string(),
//     email: v.string(),

//   },
//   handler: async (ctx,args) => {
//     // If user already exist
//     const existing = await ctx.db
//     .query("users")
//     .filter((q) => q.eq(q.field("email"), args.email))
//     .collect();

//     // If not then add new user
//     if (existing.length === 0) {
//       await ctx.db.insert("users", {
//         name: args.name,
//         email: args.email,
//         credits: 50000,
//       });
//     }
//   },
// });

import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existing) {
      return existing._id; // ✅ Return existing user's _id
    }

    // Insert new user
    const newUserId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      credits: 50000,
    });

    return newUserId; // ✅ Return newly created _id
  },
});


export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();
  },
});

export const UpdateUserToken = mutation({
  args: {
    id: v.id('users'),
    credits: v.number(),
  },
  handler: async(ctx, args) => {
    await ctx.db.patch(args.id, {
      credits: args.credits
    })
  }
})