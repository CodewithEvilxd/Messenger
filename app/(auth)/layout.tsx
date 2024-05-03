"use client"
import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next13-progressbar'
import Loading from '../_components/UI/Loading'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {

    const router = useRouter()
    const session = useSession()
    const [checking, setChecking] = useState(true)


    useEffect(() => {
        if (session.status === "authenticated") {
            router.push("/conversations")
            router.refresh()
        } else if (session.status === "unauthenticated") {
            setChecking(false)
        }
    }, [session, router])

    if (checking) {
        return <Loading />
    } else {
        return children
    }
}

export default AuthLayout