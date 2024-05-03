import { FullConversationType } from '@/shared/types/Conversation'
import Image from 'next/image';
import React from 'react'

const AvatarGroup = ({ data }: { data: FullConversationType }) => {

    const users = data.users
    const slicedUsers = users.slice(0, 3);

    const positionMap = {
        0: 'top-0 left-[12px]',
        1: 'bottom-0',
        2: 'bottom-0 right-0'
    }

    return (
        <div className="size-11 shrink-0 relative">
            {slicedUsers.map((user, index) => (
                <div
                    key={user.id}
                    className={` shrink-0 absolute inline-block  rounded-full  overflow-hidden h-[21px] w-[21px] ${positionMap[index as keyof typeof positionMap]}`}>
                    <Image fill src={user?.image || '/placeholder.jpg'} alt="Avatar"
                        className="object-cover" />
                </div>
            ))}
        </div>
    );
}

export default AvatarGroup