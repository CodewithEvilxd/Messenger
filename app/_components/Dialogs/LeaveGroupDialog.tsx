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

export const LeaveGroupDialog = () => {

    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { conversationId } = useConversation()
    const [isLeaving, setIsLeaving] = useState(false)

    const onSuccessDelete = () => {
        setIsLeaving(false)
        router.push("/conversations")
        router.refresh()
    }

    const handleLeaveConversation = async () => {
        setIsLeaving(true)
        PromiseNotification(
            axios.post(`/api/conversations/${conversationId}`),
            "Successfully, left this group!",
            onSuccessDelete
        )
    }

    return (
        <>
            <Button variant={"destructive"} onClick={() => setOpen(true)}>Leave Group</Button>
            <AlertDialog open={open} onOpenChange={() => setOpen(false)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will not be able to access this conversations in future!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLeaving}>Cancel</AlertDialogCancel>
                        {
                        }
                        <AlertDialogAction className='bg-messangerBlue hover:bg-blue-500' onClick={handleLeaveConversation} disabled={isLeaving}>Yes</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}