import { getCurrentUser } from "@/shared/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prismadb";
import { pusherServer } from "@/shared/lib/pusher";
import { update } from "lodash";
import { FullMessageType } from "@/shared/types/Conversation";

interface ParamsType {
  conversationId: string;
}

export async function POST(
  req: NextRequest,
  { params: { conversationId } }: { params: ParamsType }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("You are not authenticated", { status: 400 });
    }
    const conversationWithMessageAndUser = await prisma.conversation.findUnique(
      {
        where: {
          id: conversationId,
        },
        include: {
          messages: {
            include: {
              seenBy: true,
            },
          },
          users: true,
        },
      }
    );
    if (!conversationWithMessageAndUser) {
      return new NextResponse("Invalid conversation id", { status: 400 });
    }

    const totalMessages = conversationWithMessageAndUser.messages.length;
    const lastMessageIndex = totalMessages - 1;

    const newConversation = conversationWithMessageAndUser.messages.map(
      async (message, index) => {
        const seenByArr = message.seenIds;
        const isPresent = seenByArr.find((id) => id === currentUser.id);
        let updatedMessage: FullMessageType = {} as FullMessageType;
        if (!isPresent) {
          updatedMessage = await prisma.message.update({
            where: {
              id: message.id,
            },
            include: {
              seenBy: true,
              sender: true,
            },
            data: {
              seenBy: {
                connect: {
                  id: currentUser.id,
                },
              },
            },
          });
          if (index === lastMessageIndex) {
            await pusherServer.trigger(
              conversationId!,
              "message:update",
              updatedMessage
            );
          }
        }
        return updatedMessage;
      }
    );

    await pusherServer.trigger(
      currentUser.email!,
      "last:message:seen",
      conversationId
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.log("Conversationd-Seen-err");
    return new NextResponse("Something went wrong!", { status: 501 });
  }
}
