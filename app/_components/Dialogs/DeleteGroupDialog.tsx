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
} from "@/shared/components/ui/alert-dialog"
import { Button } from '@/shared/components/ui/button'
import { useConversation } from '@/shared/hooks/useConversation'
import axios from "axios"
import { PromiseNotification } from '../../../shared/lib/AxiosApiResNotification'
import { useRouter } from 'next13-progressbar'

const DeleteGroupDialog = () => {

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { conversationId } = useConversation()
    const [isLeaving, setIsLeaving] = useState(false)

    const onSuccessDelete = () => {
        setIsLeaving(false)
        router.push("/conversations")
    }

    const handleDeleteConversation = async () => {
        setIsLeaving(true)
        PromiseNotification(
            axios.delete(`/api/conversations/${conversationId}`),
            "Successfully, deleted this group!",
            onSuccessDelete
        )
    }

    return (
        <>
            <Button variant={"destructive"} onClick={() => setOpen(true)}>Delete Group</Button>
            <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will not be able to access thes conversations in future!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
                        {
                        }
                        <AlertDialogAction className='bg-messangerBlue hover:bg-blue-500' onClick={handleDeleteConversation} disabled={isLeaving}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default DeleteGroupDialog