import React from 'react'
import SideBar from '../../_components/UI/SideBar'
import { getUsers } from '@/shared/actions/getUsers'
import UsersComponent from '@/app/_components/User/UsersComponent'

const UsersLayout = async ({ children }: { children: React.ReactNode }) => {

    const users = await getUsers()

    return (
        <SideBar>
            <UsersComponent users={users}>
                {children}
            </UsersComponent>
        </SideBar>
    )
}

export default UsersLayout