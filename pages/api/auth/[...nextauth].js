import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../../../src/lib/prisma";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // For security, use a generic error message for both cases
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password.");
        }

        // Return the user object to be encoded in the JWT
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar
        };
      },
    }),
  ],
  pages: {
    signIn: "/Login",
  },
  callbacks: {
    // This callback runs when a JWT is created or updated.
    async jwt({ token, user, trigger, session }) {
      // On initial sign-in, the `user` object is passed.
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.avatar = user.avatar;
      }

      // This block is triggered when `update()` is called from the client.
      if (trigger === "update") {
        // Actively refetch the user from the database to get the latest info.
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
        });

        if (dbUser) {
          // Update the token with the fresh data.
          token.name = dbUser.name;
          token.avatar = dbUser.avatar;
        }
      }

      return token;
    },
    // This callback makes the token data available to the client-side session object.
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);