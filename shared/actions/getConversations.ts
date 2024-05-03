"use server";
import { getCurrentUser } from "./getCurrentUser";
import prisma from "../lib/prismadb";
import { FullConversationType } from "../types/Conversation";

export const getConversations = async (): Promise<FullConversationType[]> => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) {
    return [];
  }
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            seenBy: true,
          },
        },
      },
    });
    return conversations;
  } catch (err) {
    return [];
  }
};
