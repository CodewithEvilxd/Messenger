"use client"
import { useConversation } from '@/shared/hooks/useConversation'
import { cn } from '@/shared/lib/utils'
import { FullConversationType } from '@/shared/types/Conversation'
import React, { useEffect, useMemo, useState } from 'react'
import ConversationItem from './ConversationItem'
import { User } from '@prisma/client'
import { CreateGroupDialog } from '../Dialogs/CreateGroupDialog'
import { useSession } from 'next-auth/react'
import { pusherClient } from '@/shared/lib/pusher'
import { useRouter } from 'next13-progressbar'
import EmptyResource from '../UI/EmptyResource'
import { useUserContext } from '@/shared/context/UserContext'
import { useOtherUser } from '@/shared/hooks/useOtherUser'
import toast from 'react-hot-toast'

interface Props {
    conversations: FullConversationType[],
    users: User[]
}

const ConversationList = ({ conversations, users }: Props) => {

    const session = useSession()
    const router = useRouter()
    const { conversationId, isOpen } = useConversation()
    const { currentUser } = useUserContext()
    const [allConversations, setAllConversations] = useState(conversations)

    const pusherKey = useMemo(() => {
        return session?.data?.user?.email
    }, [session?.data?.user?.email])

    useEffect(() => {

        if (!pusherKey) {
            return;
        }

        const newConversationHandler = (newConversation: FullConversationType) => {
            setAllConversations(current => {
                const isNewConvAlreadyPresent = current.find(ele => ele.id === newConversation.id)
                if (isNewConvAlreadyPresent) {
                    return current
                }
                return [...current, newConversation]
            })
        }

        const conversationUpdateHandler = (updateConversation: FullConversationType) => {
            setAllConversations(current => current.map(currConv => {
                if (currConv.id === updateConversation.id) {
                    return {
                        ...currConv,
                        messages: updateConversation.messages
                    }
                } else {
                    return currConv
                }
            }))
        }

        const conversationDeleteHandler = ({ conversation: deleteConversation, deletedBy }: { conversation: FullConversationType, deletedBy: { id: string, name: string } }) => {
            setAllConversations(current => { return [...current.filter(conv => conv.id !== deleteConversation.id)] })
            if (conversationId === deleteConversation.id) {
                router.push("/conversations")
            }
            if (currentUser.id !== deletedBy.id) {
                toast(`${deletedBy.name} Deleted This Conversation`,
                    {
                        icon: '❗️',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );
            }
        }

        const handleConversationLeft = ({ convContent, leftUserId }: { convContent: FullConversationType, leftUserId: string }) => {
            if (currentUser.id === leftUserId) {
                setAllConversations((prevConversations) => {
                    const newConvData = prevConversations.filter((conversation) => {
                        if (conversation.id !== convContent.id) {
                            return conversation
                        }
                    })
                    return [...newConvData]
                })
            }
        }

        const handleGroupMemberLeft = ({ convContent, leftUserId, leftUserName }: { convContent: FullConversationType, leftUserId: string, leftUserName: string }) => {
            if (currentUser.id !== leftUserId) {
                setAllConversations((prevConversations) => {
                    return prevConversations.map((conversation) => {
                        if (conversation.id !== convContent.id) {
                            return conversation
                        } else {
                            return convContent
                        }
                    })
                })
                // toast(`${leftUserName} left ${convContent.name} Conversation!!`,
                //     {
                //         icon: '🥲',
                //         style: {
                //             borderRadius: '10px',
                //             background: '#333',
                //             color: '#fff',
                //         },
                //     }
                // );
            }
        }

        pusherClient.subscribe(pusherKey)
        pusherClient.bind("conversation:new", newConversationHandler)
        pusherClient.bind("conversation:update", conversationUpdateHandler)
        pusherClient.bind("conversation:remove", conversationDeleteHandler)
        pusherClient.bind("you:left", handleConversationLeft)
        pusherClient.bind("group:member:left", handleGroupMemberLeft)

        return () => {
            pusherClient.unsubscribe(pusherKey)
            pusherClient.unbind("conversation:new", newConversationHandler)
            pusherClient.unbind("conversation:update", conversationUpdateHandler)
            pusherClient.unbind("conversation:remove", conversationDeleteHandler)
            pusherClient.unbind("you:left", handleConversationLeft)
            pusherClient.bind("group:member:left", handleGroupMemberLeft)
        }
    }, [pusherKey, router, conversationId])

    return (
        <aside className={cn("px-5 pb-20 lg:pb-0 lg:w-[430px] lg:block overflow-y-auto border-r border-gray-100 block w-full", isOpen ? "hidden" : "block")}>
            {
                allConversations.length > 0 ? (
                    <div className="px-1">
                        <div className="flex justify-between mb-4 pt-4">
                            <div className="text-2xl font-bold text-neutral-800">
                                Message
                            </div>
                            <CreateGroupDialog users={users} />
                        </div>
                        <div className="flex flex-col w-full space-y-2">
                            {
                                allConversations.map((conversation: FullConversationType) => (
                                    <ConversationItem key={conversation.id} data={conversation} selected={conversationId === conversation.id} />
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full flex flex-col">
                        <div className="w-full flex justify-between mb-4 pt-4">
                            <div className="text-2xl font-bold text-neutral-800">
                                Message
                            </div>
                            <CreateGroupDialog users={users} />
                        </div>
                        <EmptyResource image={"/message.png"} heading={"No conversations found!"} message="Please first create conversation by click on user from users list" />
                    </div>
                )
            }
        </aside>
    )
}

export default ConversationList