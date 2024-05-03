"use server";
import prisma from "../lib/prismadb";
import { FullConversationType } from "../types/Conversation";
import { getCurrentUser } from "./getCurrentUser";

export const getConversationByIdWithMessages = async (
  conversationId: string
): Promise<FullConversationType | null> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;
    const conversationWithMessages = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: true,
            seenBy: true,
          },
        },
      },
    });
    return conversationWithMessages;
  } catch (err) {
    return null;
  }
};
