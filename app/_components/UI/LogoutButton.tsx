"use client"
import React from 'react'
import { Button } from '@/shared/components/ui/button'
import { signOut } from 'next-auth/react'

const LogoutButton = () => {
    return (
        <Button onClick={() => signOut()}> Logout</Button>
    )
}

export default LogoutButton