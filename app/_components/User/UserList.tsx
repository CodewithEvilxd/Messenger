import { User } from '@prisma/client'
import React from 'react'
import UserItem from './UserItem'
import EmptyResource from '../UI/EmptyResource'

const UserList = ({ users }: { users: User[] }) => {

    return (
        <aside className="px-5 pb-20 lg:pb-0 lg:w-[430px] lg:block overflow-y-auto border-r border-gray-200 block w-full">
            {
                users.length > 0 ? (
                    <div className="px-1">
                        <div className="flex justify-between mb-4 pt-4">
                            <div className="text-2xl font-bold text-neutral-800">
                                People
                            </div>
                        </div>
                        <div className="flex flex-col w-full ">
                            {
                                users.map((user: User) => (
                                    <UserItem key={user.id} user={user} />
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <EmptyResource image={"/user.png"} heading={"No other user found!"} message="Please share this application with your friends." fromUsers/>
                    </div>
                )
            }
        </aside>
    )
}

export default UserList