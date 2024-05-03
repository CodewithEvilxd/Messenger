import { ConversationBodyAndInputForm } from '@/app/_components/Conversation/ConversationBodyAndForm'
import ConversationsHeader from '@/app/_components/Conversation/ConversationsHeader'
import { getConversationByIdWithMessages } from '@/shared/actions/getConversationByIdWithMessages'
import { FullConversationType } from '@/shared/types/Conversation'
import { redirect } from 'next/navigation'
import React from 'react'

interface ConversationIdPageProps {
    params: { conversationId: string }
}

const ConversationIdPage = async ({ params: { conversationId } }: ConversationIdPageProps) => {

    const conversationByIdWithMessages: FullConversationType | null = await getConversationByIdWithMessages(conversationId)

    if (!conversationByIdWithMessages) {
        redirect("/conversations")
        return null;
    }

    return (
        <div className="h-full w-full flex flex-col justify-between ">
            <ConversationsHeader conversation={conversationByIdWithMessages} />
            <ConversationBodyAndInputForm conversationByIdWithMessages={conversationByIdWithMessages} />
        </div>
    )
}

export default ConversationIdPage