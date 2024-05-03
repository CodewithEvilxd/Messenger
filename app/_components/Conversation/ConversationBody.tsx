"use client"
import { FullMessageType } from '@/shared/types/Conversation'
import React, { useEffect, useRef } from 'react'
import Message from './Message'
import { useConversation } from '@/shared/hooks/useConversation'
import axios from 'axios'

const ConversationBody = ({ messages, isGroup, leftUserIds }: { messages: FullMessageType[], isGroup: boolean | null, leftUserIds: string[] }) => {

    const bottomRef = useRef<HTMLDivElement>(null)
    const { conversationId } = useConversation()

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`)
    }, [conversationId])

    useEffect(() => {
        if (bottomRef) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages])

    return (
        <div className="w-full h-[94%] overflow-y-auto overflow-hidden bg-gray-50 pb-40">
            {
                messages.map((message, index) => (
                    <Message key={message.id} data={message} isLast={index === messages.length - 1} isGroupMessage={isGroup} leftUserIds={leftUserIds} />
                ))
            }
            <div ref={bottomRef} />
        </div>
    )
}

export default ConversationBody