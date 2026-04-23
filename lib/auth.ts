import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // セッションはJWTを使用
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          favoriteTeam: user.favoriteTeam,
        };
      },
    }),
  ],
  callbacks: {
    // トークンに favoriteTeam などを追加
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.favoriteTeam = (user as any).favoriteTeam;
      }
      return token;
    },
    // セッションオブジェクトに情報を同期
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).favoriteTeam = token.favoriteTeam as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});