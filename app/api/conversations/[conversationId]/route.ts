import { getCurrentUser } from "@/shared/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prismadb";
import { pusherServer } from "@/shared/lib/pusher";

export async function DELETE(
  req: NextRequest,
  { params: { conversationId } }: { params: { conversationId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("User not authenticated!", { status: 400 });
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: true,
      },
    });
    if (!conversation) {
      return new NextResponse(
        "Conversation with this id is not present in the database!",
        { status: 400 }
      );
    }
    const isUserMemberOfConversation = conversation.users.filter(
      (user) => user.id === currentUser.id
    );
    if (!isUserMemberOfConversation) {
      return new NextResponse(
        "You cannot delete this conversation as don't belong to this conversation.",
        { status: 400 }
      );
    }
    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        userIds: {
          hasSome: [currentUser.id],
        },
      },
    });

    conversation.users.map((user) => {
      pusherServer.trigger(user.email!, "conversation:remove", {
        conversation,
        deletedBy: {
          id: currentUser.id,
          name: currentUser.name,
        },
      });
    });

    return NextResponse.json(deletedConversation);
  } catch (err) {
    console.log("CONV-DEL-ERR", err);
    return new NextResponse("Something went wrong!", { status: 501 });
  }
}

export async function POST(
  req: NextRequest,
  { params: { conversationId } }: { params: { conversationId: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("User not authenticated!", { status: 400 });
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        users: true,
        messages: true,
      },
    });
    if (!conversation) {
      return new NextResponse(
        "Conversation with this id is not present in the database!",
        { status: 400 }
      );
    }
    const isUserMemberOfConversation = conversation.users.filter(
      (user) => user.id === currentUser.id
    );
    if (!isUserMemberOfConversation) {
      return new NextResponse(
        "You cannot leave this conversation as you don't belong to this conversation.",
        { status: 400 }
      );
    }

    const updatedConversation = await prisma.conversation.update({
      where: {
        id: conversationId,
      },
      data: {
        users: {
          disconnect: {
            id: currentUser.id,
          },
        },
        leftUsers: {
          connect: [
            {
              id: currentUser.id,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    updatedConversation.users.forEach((user) => {
      pusherServer.trigger(user.email!, "group:member:left", {
        convContent: updatedConversation,
        leftUserId: currentUser.id,
        leftUserName : currentUser.name
      });
    });

    pusherServer.trigger(currentUser.email!, "you:left", {
      convContent: updatedConversation,
      leftUserId: currentUser.id,
    });

    return new NextResponse("You have left the chat!", { status: 200 });
  } catch (err) {
    console.log("CONV-DEL-ERR", err);
    return new NextResponse("Something went wrong!", { status: 501 });
  }
}
