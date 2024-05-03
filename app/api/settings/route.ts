import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/lib/prismadb";
import { getCurrentUser } from "@/shared/actions/getCurrentUser";
import { pusherServer } from "@/shared/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return new NextResponse("Your are not authenticated", { status: 400 });
    }
    const { name, image } = await req.json();
    const newUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        image,
      },
    });
    pusherServer.trigger("users-event", "user:profile:update", {
      user: newUser,
    });
    return NextResponse.json(newUser);
  } catch (err) {
    console.log("USER-ERR", err);
    return new NextResponse("Something went wrong!", { status: 501 });
  }
}
