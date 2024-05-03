import { getCurrentUser } from "@/shared/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prismadb";
import { pusherServer } from "@/shared/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser?.email) {
      return new NextResponse("You are not authenticated!", { status: 400 });
    }
    const { body, conversationId, image } = await req.json();

    if (!conversationId) {
      return new NextResponse("ConversationId is missing!", {
        status: 400,
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        body,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seenBy: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include: {
        seenBy: true,
        sender: true,
      },
    });

    const newUpdatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            seenBy: true,
            sender: true,
          },
        },
      },
    });
    // jis conversation pe new message aya h uss conversation pe ye message send kardia
    await pusherServer.trigger(conversationId, "messages:new", newMessage);
    const lastMessage =
      newUpdatedConversation.messages[
        newUpdatedConversation.messages.length - 1
      ];
    // sare users ko last message send kar dia
    newUpdatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:update", {
        id: conversationId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (err) {
    console.log("Messages-Err", err);
    return new NextResponse("Something went wrong!", { status: 501 });
  }
}
