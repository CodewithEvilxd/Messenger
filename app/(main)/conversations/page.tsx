"use client"
import EmptyState from '@/app/_components/UI/EmptyState'
import { useConversation } from '@/shared/hooks/useConversation'
import { cn } from '@/shared/lib/utils'
import React from 'react'

const ConversationsPage = () => {

    const { isOpen } = useConversation()

    return (
        <div className={cn("h-full w-full", "h-full lg:block", isOpen ? "block" : "hidden")}>
            <EmptyState />
        </div>
    )
}

export default ConversationsPage