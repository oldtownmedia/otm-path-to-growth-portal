import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[AUTH] Authorize called with email:", credentials?.email);
        console.log("[AUTH] DIRECT_DATABASE_URL set:", !!process.env.DIRECT_DATABASE_URL);
        console.log("[AUTH] DATABASE_URL set:", !!process.env.DATABASE_URL);

        if (!credentials?.email || !credentials?.password) {
          console.log("[AUTH] Missing credentials");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log("[AUTH] User found:", !!user, user?.email);

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          console.log("[AUTH] Password valid:", isValid);

          if (!isValid) return null;
        } catch (error) {
          console.error("[AUTH] Database error:", error);
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: "ADMIN" | "CLIENT" }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "yt25dlXDIOZmtCV0rZXO/VPFc9B3UhQ/8pLW2UCezt8=",
};
