import { getCurrentUser } from "@/shared/actions/getCurrentUser";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prismadb";
import { pusherServer } from "@/shared/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const { userId, isGroup, members, name } = await req.json();
    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized user", { status: 400 });
    }
    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Invalid data for creating a group!", {
        status: 400,
      });
    }
    if (isGroup) {
      const newGroupConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
          adminId: currentUser.id,
        },
        include: {
          users: true,
        },
      });

      newGroupConversation.users.map((user) => {
        if (user.email) {
          pusherServer.trigger(
            user.email,
            "conversation:new",
            newGroupConversation
          );
        }
      });

      return NextResponse.json(newGroupConversation);
    }
    const isPeerToPeerConversationsPresent = await prisma.conversation.findMany(
      {
        where: {
          OR: [
            {
              userIds: {
                equals: [currentUser.id, userId],
              },
            },
            {
              userIds: {
                equals: [userId, currentUser.id],
              },
            },
          ],
        },
      }
    );
    if (isPeerToPeerConversationsPresent[0]) {
      return NextResponse.json(isPeerToPeerConversationsPresent[0]);
    }
    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
        adminId: currentUser.id,
      },
      include: {
        users: true,
      },
    });
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, "conversation:new", newConversation);
      }
    });
    return NextResponse.json(newConversation);
  } catch (err) {
    return new NextResponse("Something went wrong", { status: 501 });
  }
}
