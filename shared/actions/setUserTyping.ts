"use server";
import { User } from "@prisma/client";
import { pusherServer } from "../lib/pusher";

export const setUserTyping = async (
  currentUser: User,
  conversationId: string,
  content: string,
  isTyping: boolean
) => {
  if (currentUser && Object.keys(currentUser).length > 0 && conversationId) {
    pusherServer.trigger(conversationId, "member:typing", {
      user: currentUser,
      isTyping: isTyping,
    });
  }
};
