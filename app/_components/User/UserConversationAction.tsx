import React, { useMemo } from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/components/ui/sheet"
import { Button } from '@/shared/components/ui/button'
import { EllipsisVertical } from 'lucide-react'
import { FullConversationType } from '@/shared/types/Conversation'
import AvatarComp from '../UI/AvatarComp'
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import { format } from 'date-fns'
import DeleteConversationDialog from '../Dialogs/DeleteConversationDialog'
import { useUserContext } from '@/shared/context/UserContext'
import { LeaveGroupDialog } from '../Dialogs/LeaveGroupDialog'

const UserConversationAction = ({ conversation }: { conversation: FullConversationType }) => {

    const otherUsers = useOtherUser(conversation)
    const { currentUser } = useUserContext()

    const joinedDate = useMemo(() => {
        return format(new Date(otherUsers.createdAt), 'PP')
    }, [otherUsers?.createdAt])

    const title = useMemo(() => {
        return conversation.name || otherUsers.name
    }, [conversation.name, otherUsers.name])

    const isAdmin = conversation.adminId === currentUser.id

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
            return `${conversation.users.length} members`
        }
        return "Active"
    }, [conversation])

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"ghost"}>
                    <EllipsisVertical className='text-messangerBlue size-5' />
                </Button>
            </SheetTrigger>
            <SheetContent className='space-y-5 flex flex-col pt-8'>
                <SheetHeader>
                    <SheetTitle className='text-2xl font-bold text-neutral-900 capitalize'>{conversation?.isGroup ? title : "Conversation Details"}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-1 grow overflow-y-auto ">
                    <span className="text-xl font-bold text-neutral-800">{statusText}</span>
                    <div>
                        {
                            !conversation.isGroup && (
                                <div className="flex items-center space-x-3  hover:bg-gray-100 transition-all duration-300 p-2 cursor-pointer rounded-xl border-[1px] hover:border-gray-200 border-transparent" key={otherUsers.id}>
                                    <AvatarComp user={otherUsers} />
                                    <div className="flex flex-col pr-4 w-full">
                                        <span className="text-md  font-bold text-neutral-950 caption-top">{otherUsers.name}</span>
                                        <span className="text-[13px] truncate w-[98%] font-normal text-gray-700">{otherUsers.email}</span>
                                    </div>
                                </div>
                            )
                        }
                        {
                            conversation.isGroup && conversation.users.map((member) => (
                                <div key={member.id} className="flex items-center space-x-3  hover:bg-gray-100 transition-all duration-300 p-2 cursor-pointer rounded-xl border-[1px] hover:border-gray-200 border-transparent">
                                    <AvatarComp user={member} />
                                    <div className="flex flex-col pr-4 w-full">
                                        <span className="text-md  font-bold text-neutral-950 caption-top">{member.name}</span>
                                        <span className="text-[13px] truncate w-[98%] font-normal text-gray-700">{member.email}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                {
                    conversation.isGroup && isAdmin && <DeleteConversationDialog />
                }
                {
                    conversation.isGroup && !isAdmin && <LeaveGroupDialog />
                }
                {
                    !conversation.isGroup  && <DeleteConversationDialog />
                }
            </SheetContent>
        </Sheet>

    )
}

export default UserConversationAction