"use client"
import { FullConversationType, FullMessageType } from '@/shared/types/Conversation'
import React, {  useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { chatInputFormSchema, chatInputFormSchemaType  } from '../Forms/chat-input-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import axios from 'axios'
import { Button } from '@/shared/components/ui/button'
import { ImageUp, SendHorizontal } from 'lucide-react'
import { CldUploadButton } from "next-cloudinary"
import { useRouter } from 'next13-progressbar'
import { cn } from '@/shared/lib/utils'
import { useConversation } from '@/shared/hooks/useConversation'
import { useUserContext } from '@/shared/context/UserContext'
import { setUserTyping } from '@/shared/actions/setUserTyping'

const ConversationForm = ({ conversation, setMessageInState }: { conversation: FullConversationType, setMessageInState: (newMessage: FullMessageType) => void }) => {

    const router = useRouter()
    const [errMsg, setErrMsg] = useState("")
    const [render, setRender] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);
    const { conversationId } = useConversation()
    const { currentUser } = useUserContext()

    const chatInputFormDefaultValue = {
        body: "",
    }

    const chatInputForm = useForm<z.infer<chatInputFormSchemaType>>({
        resolver: zodResolver(chatInputFormSchema),
        defaultValues: chatInputFormDefaultValue
    })

    const formBodyValue = chatInputForm.watch("body")

    async function onSubmit(values: z.infer<chatInputFormSchemaType>) {
        if (inputRef.current) {
            inputRef.current.blur()
        }
        if (values.body) {
            setErrMsg("")
            chatInputForm.reset()
            try {
                const newMessage = ((await axios.post("/api/messages", { ...values, conversationId: conversation.id })).data as FullMessageType)
                setMessageInState(newMessage)
                router.refresh()
            } catch (err) {
                console.log("User-Input-Send", err)
            }
        } else {
            setErrMsg("Message cannot be empty!")
        }
    }

    const handleImageUpload = async (result: any) => {
        const imageUrl = result?.info?.secure_url
        setUserTyping(currentUser, conversationId, formBodyValue, false)
        await axios.post("/api/messages", {
            image: imageUrl,
            conversationId: conversation.id
        })
    }

    useEffect(() => {
        setErrMsg("")
    }, [formBodyValue])

    useEffect(() => {
        setRender(true)
    }, [])

    if (!render) return null

    return (
        <div className="w-full  bg-white py-2 pl-3 gap-x-4 flex items-start h-[6%]">
            <CldUploadButton options={{ maxFiles: 1 }} uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!} onSuccess={handleImageUpload}>
                <Button variant={"ghost"} className='bg-messangerBlue hover:bg-messangerBlue'>
                    <ImageUp className="size-7 text-white" />
                </Button>
            </CldUploadButton>
            <Form {...chatInputForm}>
                <form onSubmit={chatInputForm.handleSubmit(onSubmit)} className='flex-1 flex items-start gap-x-4 pr-4'>
                    <FormField
                        control={chatInputForm.control}
                        name="body"
                        render={({ field }) => (
                            <FormItem className='grow'>
                                <FormControl>
                                    <Input placeholder={errMsg || "Send message!"}   {...field} onFocus={() => {
                                        setUserTyping(currentUser, conversationId, formBodyValue, true)
                                    }} onBlur={() => {
                                        setUserTyping(currentUser, conversationId, formBodyValue, false)
                                    }} className={cn('flex-1 ', errMsg ? "focus-visible:ring-red-600 placeholder:text-red-600" : "focus-visible:ring-messangerBlue")} ref={inputRef} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button variant={"ghost"} className='bg-messangerBlue hover:bg-messangerBlue'>
                        <SendHorizontal className="text-white size-6" />
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default ConversationForm