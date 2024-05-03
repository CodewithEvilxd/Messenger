import { usePathname } from "next/navigation";
import { HiArrowLeftOnRectangle, HiUsers } from "react-icons/hi2";
import { useConversation } from "./useConversation";
import { useMemo } from "react";
import { BsChatRightDots } from "react-icons/bs";
import { signOut } from "next-auth/react";

export const useRoute = () => {
  const pathName = usePathname();
  const { isOpen } = useConversation();
  const routes = useMemo(
    () => [
      {
        label: "Chat",
        href: "/conversations",
        icon: BsChatRightDots,
        active: pathName === "/conversations" || isOpen,
      },
      {
        label: "Users",
        href: "/users",
        icon: HiUsers,
        active: pathName === "/users",
      },
      {
        label: "Logout",
        href: "#",
        onClick: () => signOut(),
        icon: HiArrowLeftOnRectangle,
      },
    ],
    [pathName, isOpen]
  );
  return routes;
};
