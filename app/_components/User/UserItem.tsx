"use client"
import { User } from '@prisma/client'
import React, { useCallback } from 'react'
import AvatarComp from '../UI/AvatarComp'
import axios from "axios"
import { useRouter } from 'next13-progressbar'
import { PromiseNotification } from '../../../shared/lib/AxiosApiResNotification'

const UserItem = ({ user }: { user: User }) => {

    const router = useRouter()

    const handleClick = useCallback(async () => {
        PromiseNotification(
            axios.post("/api/conversations", {
                userId: user.id
            }).then((data) => {
                router.push(`/conversations`)
                router.refresh()
            }),
            "Here you go!"
        )
    }, [user.id, router])

    return (
        <div className="shring-0 flex items-center space-x-3  hover:bg-gray-100 transition-all duration-300 p-2 cursor-pointer rounded-xl border-[1px] hover:border-gray-200 border-transparent" onClick={handleClick}>
            <AvatarComp user={user} />
            <div className="flex flex-col pr-4 w-full">
                <span className="text-md  font-bold text-neutral-950 caption-top">{user.name}</span>
                <span className="text-[13px] truncate w-[98%] font-normal text-gray-700">{user.email}</span>
            </div>
        </div>
    )
}

export default UserItem