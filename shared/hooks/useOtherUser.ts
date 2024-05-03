import { useSession } from "next-auth/react";
import { FullConversationType } from "../types/Conversation";
import { useMemo } from "react";

export const useOtherUser = (conversation: FullConversationType) => {
  const session = useSession();
  const currentUserEmail = session?.data?.user?.email;
  const otherUser = useMemo(() => {
    return conversation.users.filter((user) => user.email !== currentUserEmail);
  }, [conversation, currentUserEmail]);
  return otherUser[0];
};
