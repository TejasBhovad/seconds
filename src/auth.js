import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getUserByEmail, createUser } from "@/actions/user";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          // Check if user already exists using your action
          const existingUser = await getUserByEmail(user.email);

          if (!existingUser) {
            // Create new user using your action
            const userData = {
              name: user.name,
              email: user.email,
              image: user.image || "",
            };

            await createUser(userData);
            console.log("New user created:", user.email);
          } else {
            console.log("User already exists:", user.email);
          }

          return true;
        } catch (error) {
          console.error("Error saving user to database:", error);
          return false; // This will prevent sign in
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // Add custom fields to token if needed
      if (user) {
        try {
          const dbUser = await getUserByEmail(user.email);
          if (dbUser) {
            token.slug = dbUser.slug;
            token.userId = dbUser._id.toString();
          }
        } catch (error) {
          console.error("Error fetching user in JWT callback:", error);
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user.slug = token.slug;
        session.user.id = token.userId;
      }
      return session;
    },
  },
});
