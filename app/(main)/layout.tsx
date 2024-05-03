import { UserContextProvider } from '@/shared/context/UserContext'
import React from 'react'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <UserContextProvider>
            {children}
        </UserContextProvider>
    )
}

export default MainLayout