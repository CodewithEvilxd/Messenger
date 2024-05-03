import NextAuth from "next-auth";
import { NextAuthOptions } from "@/shared/lib/authOptions";

const handler = NextAuth(NextAuthOptions);
export { handler as GET, handler as POST };
