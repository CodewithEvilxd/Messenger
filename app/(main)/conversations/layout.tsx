import ConversationList from '@/app/_components/Conversation/ConversationList'
import SideBar from '@/app/_components/UI/SideBar'
import { getConversations } from '@/shared/actions/getConversations'
import { getUsers } from '@/shared/actions/getUsers'
import { FullConversationType } from '@/shared/types/Conversation'
import React from 'react'

const ConversationLayout = async ({ children }: { children: React.ReactNode }) => {

    const conversations: FullConversationType[] = await getConversations()
    const users = await getUsers()

    return (
        <SideBar>
            <div className="h-full flex">
                <ConversationList conversations={conversations} users={users} />
                {children}
            </div>
        </SideBar>
    )
}

export default ConversationLayout