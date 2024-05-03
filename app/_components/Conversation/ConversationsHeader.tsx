"use client"
import React, { useEffect, useMemo, useState } from 'react'
import AvatarComp from '../UI/AvatarComp'
import { FullConversationType } from '@/shared/types/Conversation'
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import UserConversationAction from '../User/UserConversationAction'
import AvatarGroup from '../UI/AvatarGroup'
import { pusherClient } from '@/shared/lib/pusher'
import { useParams } from 'next/navigation'
import { User } from '@prisma/client'
import { cn } from '@/shared/lib/utils'
import { useUserContext } from '@/shared/context/UserContext'
import toast from 'react-hot-toast'

interface ConversationHeaderProps {
    conversation: FullConversationType
}

const ConversationsHeader = ({
    conversation
}: ConversationHeaderProps) => {

    const { conversationId } = useParams()
    const [currentConversation, setCurrentConversation] = useState<FullConversationType>(conversation)
    const otherUserDetails = useOtherUser(currentConversation)
    const [userTyping, setUserTyping] = useState<User>({} as User)
    const { currentUser } = useUserContext()

    const statusText = useMemo(() => {
        if (currentConversation.isGroup) {
            return `${currentConversation.users.length} members`
        }
        return "Active"
    }, [currentConversation])

    const handleConversationMemberTyping = ({ user, isTyping }: { user: User, isTyping: boolean }) => {
        if (isTyping) {
            setUserTyping({ ...user })
        } else {
            setUserTyping({} as User)
        }
    }

    const handleConversationLeft = ({ convContent, leftUserId }: { convContent: FullConversationType, leftUserId: string }) => {

        if (currentUser.id !== leftUserId) {
            setCurrentConversation((prevCon) => {
                return convContent
            })
        }
    }

    useEffect(() => {
        const convId = conversationId as string
        pusherClient.subscribe(convId)
        pusherClient.subscribe(currentUser.email!)
        pusherClient.bind("member:typing", handleConversationMemberTyping)
        pusherClient.bind("group:member:left", handleConversationLeft)
        return () => {
            pusherClient.unsubscribe(convId)
            pusherClient.unbind("member:typing", handleConversationMemberTyping)
            pusherClient.unbind("group:member:left", handleConversationLeft)
        }
    }, [conversationId])

    const isUserTyping = userTyping && Object.keys(userTyping).length > 0
    const showTypingHeader = isUserTyping && currentUser.id !== userTyping.id

    return (

        <div className="w-full h-[10%]  flex flex-col">
            <div className="h-[70%] px-2 py-2 border-b-[1px] shadow-sm  border-gray-100 flex items-center justify-between">
                <div className="flex gap-x-8 items-center">
                    <div className="flex items-center">
                        <Button variant={"ghost"}>
                            <Link href="/conversations">
                                <ChevronLeft className='text-messangerBlue size-7' />
                            </Link>
                        </Button>
                        {
                            currentConversation.isGroup ? (
                                <AvatarGroup data={currentConversation} />
                            ) : (
                                <AvatarComp user={otherUserDetails} />
                            )
                        }
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-xl text-neutral-900 capitalize">{currentConversation.name || otherUserDetails.name}</span>
                        <span className="text-neutral-500 text-sm font-normal">{statusText}</span>
                    </div>
                </div>
                <UserConversationAction conversation={currentConversation} />
            </div>
            <div className={cn("h-[30%]  bg-gray-50", showTypingHeader && "")}>
                {
                    showTypingHeader && (
                        <div className="flex items-center space-x-2 h-full w-full bg-messangerBlue/10">
                            <div className="px-3 pt-2 flex justify-center items-center h-full   rounded-full">
                                <div className="dot mx-[3px] size-[6px] animate-pulse rounded-full bg-messangerBlue animate-wave-1"></div>
                                <div className="dot mx-[3px] size-[6px] animate-pulse rounded-full bg-messangerBlue animate-wave-2"></div>
                                <div className="dot mx-[3px] size-[6px] animate-pulse rounded-full bg-messangerBlue animate-wave-3"></div>
                            </div>
                            <div className='text-sm font-bold text-messangerBlue'>
                                {userTyping.name} is typing
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ConversationsHeader