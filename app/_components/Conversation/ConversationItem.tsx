import { FullConversationType, FullMessageType } from '@/shared/types/Conversation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import AvatarComp from '../UI/AvatarComp'
import { useRouter } from 'next13-progressbar'
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import { useSession } from 'next-auth/react'
import { cn } from '@/shared/lib/utils'
import AvatarGroup from '../UI/AvatarGroup'
import { pusherClient } from '@/shared/lib/pusher'

interface Props {
    data: FullConversationType,
    selected?: boolean
}

const ConversationItem = ({ data }: Props) => {

    const router = useRouter()
    const session = useSession()
    const otherUserData = useOtherUser(data)
    const [lastMessageSeen, setLastMessageSeen] = useState(false)

    const pusherKey = useMemo(() => {
        return session?.data?.user?.email
    }, [session?.data?.user?.email])

    const lastMessage: FullMessageType | "" = useMemo(() => {
        const messages = data.messages || []
        return messages.length === 0 ? "" : messages[messages.length - 1]
    }, [data])

    const currentUserEmail = useMemo(() => {
        return session?.data?.user?.email
    }, [session])

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }
        const seenArray = lastMessage?.seenBy || []
        if (!currentUserEmail) {
            return false;
        }
        const val = (seenArray.filter((seenUser) => seenUser.email === currentUserEmail)).length !== 0
        setLastMessageSeen(val)
    }, [currentUserEmail, lastMessage])


    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`)
    }, [router, data])


    const lastMessageText = useMemo(() => {
        if (!lastMessage) {
            return `Start your conversation with a message.`
        }
        if (lastMessage?.image) {
            return "Sent an image!"
        }
        if (lastMessage?.body) {
            return lastMessage.body
        }
    }, [lastMessage])

    const messagesLength = data?.messages?.length || 0
    const isNewConversation = messagesLength === 0
    const lastMessageSenderName = messagesLength > 0 ? data.messages[messagesLength - 1]?.sender?.name : null

    const handleLastMessageSeen = (conversationId: string) => {
        if (data.id === conversationId) {
            setLastMessageSeen(true)
        }
    }

    useEffect(() => {
        pusherClient.subscribe(pusherKey!)
        pusherClient.bind("last:message:seen", handleLastMessageSeen)
        return () => {
            pusherClient.unbind("last:message:seen", handleLastMessageSeen)
        }
    }, [])

    return (
        <div className="w-full overflow-hidden  grow  flex items-center space-x-3  hover:bg-gray-100 transition-all duration-300 p-2 cursor-pointer rounded-xl border-[1px] hover:border-gray-200 border-transparent " onClick={handleClick}>
            <div className='relative'>
                {
                    data.isGroup ? (
                        <AvatarGroup data={data} />
                    ) : (
                        <AvatarComp user={otherUserData} />
                    )
                }
            </div>
            <div className="grow  flex flex-col truncate pr-3">
                <span className="text-md font-bold text-neutral-950 caption-top">{data.name || otherUserData.name}</span>
                {
                    !isNewConversation && data.isGroup ? (
                        <div className={cn("text-[13px] font-medium text-gray-700 truncate flex items-center gap-x-1", !lastMessageSeen && "text-blue-700 font-bold animate-pulse")}>
                            <span className="font-bold">{lastMessageSenderName}:</span>
                            <span className="grow truncate">{lastMessageText}</span>
                        </div>
                    ) : (
                        <div className={cn("text-[13px] font-medium text-gray-700 truncate flex items-center gap-x-4", !lastMessageSeen && "text-blue-700 font-bold animate-pulse")}>
                            <span className="">{lastMessageText}</span>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ConversationItem