"use client"
import { User } from "@prisma/client"
import { createContext, useContext, useEffect, useState } from "react"
import { getCurrentUser } from "../actions/getCurrentUser"
import { Loader } from "lucide-react"
import { useRouter } from "next13-progressbar"

type UserContextType = {
    currentUser: User,
    handleUserUpdate: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<User>({} as User)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const init = async () => {
        const currentUser = (await getCurrentUser()) as User
        if (!currentUser) {
            router.push("/")
        }
        setCurrentUser({ ...currentUser })
        setLoading(false)
    }

    const handleUserUpdate = (user: User) => {
        setCurrentUser((currentUser) => {
            return { ...currentUser, image: user.image }
        })
    }

    useEffect(() => {
        init()
    }, [])

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <Loader className="animate-spin text-messangerBlue" />
            </div>
        )
    }

    const value: UserContextType = {
        currentUser: currentUser as User,
        handleUserUpdate
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error("useUserContext must be used inside UserContextProvider")
    }
    return context
}