"use client"
import React, { useEffect, useState } from 'react'
import UserList from './UserList'
import { User } from '@prisma/client'
import { pusherClient } from '@/shared/lib/pusher'
import { useUserContext } from '@/shared/context/UserContext'

const UsersComponent = ({ users, children }: { children: React.ReactNode, users: User[] }) => {

    const [usersList, setUsersList] = useState<User[]>(users)
    const { handleUserUpdate } = useUserContext()

    const handleProfileUpdate = ({ user }: { user: User }) => {
        const isPresent = usersList.findIndex(ele => ele.id === user.id)
        if (isPresent !== -1) {
            let oldUserData = usersList
            oldUserData[isPresent] = user
            setUsersList([...oldUserData])
        }
        if (isPresent === -1) {
            handleUserUpdate(user)
        }
    }

    const handleNewUserCreate = (user: User) => {
        const isPresent = usersList.findIndex(ele => ele.id === user.id)
        if (isPresent === -1) {
            setUsersList([...usersList, user])
        }
    }

    useEffect(() => {
        pusherClient.subscribe("users-event")
        pusherClient.bind("user:profile:update", handleProfileUpdate)
        pusherClient.bind("user:new", handleNewUserCreate)

        return () => {
            pusherClient.unbind("user:profile:update", handleProfileUpdate)
            pusherClient.unbind("user:new", handleNewUserCreate)
        }
    }, [])

    return (
        <div className="h-full flex">
            <UserList users={usersList} />
            {children}
        </div>
    )
}

export default UsersComponent