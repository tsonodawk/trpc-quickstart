import { db } from "./db";
import { publicProcedure, router } from "./trpc";
import * as yup from "yup";
import { createHTTPServer } from "@trpc/server/adapters/standalone";

const appRouter = router({
  userList: publicProcedure.query(async () => {
    // Retrieve users from a datasource, this is an imaginary database
    const users = await db.user.findMany();

    return users;
  }),

  userById: publicProcedure
    .input(yup.string().required())
    .query(async (opts) => {
      const { input } = opts;

      // Retrieve the user with the given ID
      const user = await db.user.findById(input);

      return user;
    }),

  userCreate: publicProcedure
    .input(yup.object({ name: yup.string().required() }))
    .mutation(async (opts) => {
      const { input } = opts;

      // Create a new user in the database
      const user = await db.user.create(input);

      return user;
    }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

const server = createHTTPServer({
  router: appRouter,
});

server.listen(3000);
