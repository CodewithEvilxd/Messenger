"use client"
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog"
import { Button } from '@/shared/components/ui/button'
import { useConversation } from '@/shared/hooks/useConversation'
import axios from "axios"
import { PromiseNotification } from '../../../shared/lib/AxiosApiResNotification'
import { useRouter } from 'next13-progressbar'

const DeleteConversationDialog = () => {

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { conversationId } = useConversation()
    const [isDeleting, setIsDeleting] = useState(false)

    const onSuccessDelete = () => {
        setIsDeleting(false)
        router.push("/conversations")
        router.refresh()
    }

    const handleDeleteConversation = async () => {
        setIsDeleting(true)
        PromiseNotification(
            axios.delete(`/api/conversations/${conversationId}`),
            "Conversation Deleted Successfully!",
            onSuccessDelete
        )
    }

    return (
        <>
            <Button variant={"destructive"} onClick={() => setOpen(true)}>Delete Conversation</Button>
            <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete all message inside this conversations, for both user!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        {
                        }
                        <AlertDialogAction className='bg-messangerBlue hover:bg-blue-500' onClick={handleDeleteConversation} disabled={isDeleting}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DeleteConversationDialog