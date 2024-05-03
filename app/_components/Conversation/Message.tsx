"use client"
import React from 'react'
import AvatarComp from '../UI/AvatarComp'
import { useSession } from 'next-auth/react'
import { FullMessageType } from '@/shared/types/Conversation'
import { cn } from '@/shared/lib/utils'
import { format } from 'date-fns'
import Image from 'next/image'
import { UserSeenList } from '../User/UsersSeenList'
import { useUserContext } from '@/shared/context/UserContext'

const Message = ({ data, isLast, isGroupMessage, leftUserIds }: { data: FullMessageType, isLast: boolean, isGroupMessage: boolean | null, leftUserIds: string[] }) => {

    const session = useSession()
    const isOwn = session?.data?.user?.email === data?.sender?.email
    const otherUserSeenList = (data.seenBy || []).filter(user => user.email !== data.sender.email)
    const didUserLeftGroup = leftUserIds.includes(data.senderId)

    return (
        <div className={cn("p-4 w-full flex items-center", isOwn ? "justify-end" : "justify-start")}>
            <div className={cn("flex space-x-3 w-auto gap-x-3", isOwn && "flex-row-reverse")}>
                <AvatarComp />
                <div className={cn("flex flex-col space-y-1", isOwn && "items-end")}>
                    <div className={cn('flex gap-x-4  px-3 items-start', isGroupMessage && !isOwn && "flex-row-reverse justify-between")}>
                        <span className="text-xs font-medium text-neutral-600 ">
                            {format(new Date(data.createdAt), 'p')}
                        </span>
                        {
                            didUserLeftGroup ? (
                                <div className='flex flex-col gap-y-1'>
                                    <span className='text-sm font-semibold text-zinc-800'>
                                        {data.sender.name}
                                    </span>
                                    <span className='text-xs text-red-600 font-semibold'>( Left )</span>
                                </div>
                            ) : (
                                <span className='text-sm font-semibold text-zinc-800'>
                                    {data.sender.name}
                                </span>)
                        }
                    </div>
                    {data.body && (
                        <div className={cn('rounded-xl shadow-sm px-7 py-2 ', isOwn ? "bg-messangerBlue text-white" : "bg-white")}>
                            {data.body}
                        </div>
                    )}
                    {
                        data.image && (
                            <div className={cn('rounded-3xl p-1 shadow-xl flex items-center justify-center', isOwn ? "bg-messangerBlue text-white" : "bg-white")}>
                                <div className='w-[99%] h-[99%] relative bg-white rounded-3xl overflow-hidden'>
                                    <Image src={data.image} alt="Message Image" width={100} height={100} priority unoptimized={true} className='size-[500px] object-cover rounded-2xl hover:scale-110 duration-300' />
                                </div>
                            </div>
                        )
                    }
                    {
                        isLast && isGroupMessage && isOwn && <UserSeenList seenUsersList={otherUserSeenList} />
                    }
                </div>
            </div>
        </div>
    )
}

export default Message