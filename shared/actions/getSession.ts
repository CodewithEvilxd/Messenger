"use server";
import { NextAuthOptions } from "../lib/authOptions";
import { getServerSession } from "next-auth";

export const getSession = async () => {
  return await getServerSession(NextAuthOptions);
};
