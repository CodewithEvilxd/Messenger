"use client"
import axios from "axios"
import ConversationBody from "./ConversationBody"
import ConversationForm from "./ConversationForm"
import { pusherClient } from "@/shared/lib/pusher"
import { useCallback, useEffect, useRef, useState } from "react"
import { FullConversationType, FullMessageType } from "@/shared/types/Conversation"
import { useUserContext } from "@/shared/context/UserContext"

export const ConversationBodyAndInputForm = ({ conversationByIdWithMessages }: { conversationByIdWithMessages: FullConversationType }) => {

    const { currentUser } = useUserContext()
    const [leftUserIds, setLeftUserIds] = useState<string[]>(conversationByIdWithMessages.leftUserIds || [])
    const { id: conversationId } = conversationByIdWithMessages
    const [messages, setMessages] = useState(conversationByIdWithMessages.messages)

    const setMessageInState = (newMessage: FullMessageType) => {
        setMessages((current) => current.map(currMess => {
            if (currMess.id === newMessage.id) {
                return newMessage
            }
            return currMess
        }))
    }

    useEffect(() => {

        pusherClient.subscribe(conversationId)

        const newMessageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`)
            setMessages((current) => {
                const isAlreadyPresent = messages.find(mesEle => mesEle.id === message.id)
                if (isAlreadyPresent) {
                    return current
                }
                return [...current, message]
            })
        }

        const messageUpdateHandler = (newMessage: FullMessageType) => {
            const messageIndex = messages.findIndex(ele => ele.id === newMessage.id)
            if (!messageIndex) {
                setMessages((current) => current.map(currMess => {
                    if (currMess.id === newMessage.id) {
                        return newMessage
                    }
                    return currMess
                }))
            } else {
                let oldMessages = messages
                oldMessages[messageIndex] = newMessage
                setMessages([...oldMessages])
            }
        }

        const handleConversationLeft = ({ convContent, leftUserId }: { convContent: FullConversationType, leftUserId: string }) => {
            setLeftUserIds(convContent.leftUserIds)
        }

        pusherClient.subscribe(currentUser.email!)
        pusherClient.bind("messages:new", newMessageHandler)
        pusherClient.bind("message:update", messageUpdateHandler)
        pusherClient.bind("group:member:left", handleConversationLeft)

        return () => {
            pusherClient.unsubscribe(conversationId)
            pusherClient.unbind("messages:new")
            pusherClient.unbind("message:update")
            pusherClient.unbind("group:member:left", handleConversationLeft)
        }
    }, [conversationId, messages])

    return (
        <div className="h-[90%] w-full bg-blue-400">
            <ConversationBody messages={messages} isGroup={conversationByIdWithMessages.isGroup} leftUserIds={leftUserIds} />
            <ConversationForm conversation={conversationByIdWithMessages} setMessageInState={setMessageInState} />
        </div>
    )
}