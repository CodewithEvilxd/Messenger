"use client"
import { useRoute } from '@/shared/hooks/useRoute'
import React, { useState } from 'react'
import DeskTopItem from './DeskTopItem'
import { User } from '@prisma/client'
import AvatarComp from './AvatarComp'
import SettingsModal from '../Dialogs/SettingsModal'
import { Button } from '@/shared/components/ui/button'
import { Settings } from 'lucide-react'
import IconPopover from './IconPopover'
import { useUserContext } from '@/shared/context/UserContext'

const DeskTopSidebar = () => {

    const routes = useRoute()
    const [openSettings, setOpenSettings] = useState(false)
    const { currentUser: currentSessionUser } = useUserContext()

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] lg:pb-4 lg:flex lg:flex-col justify-between">
            <nav className="mt-4 flex flex-col justify-between">
                <ul
                    role='list'
                    className='flex flex-col items-center space-y-1'>
                    {
                        routes.map((item) => (
                            <DeskTopItem key={item.label} {...item} />
                        ))
                    }
                </ul>
            </nav>
            <nav className="mt-4 flex flex-col space-y-3 justify-between items-center">
                <IconPopover content='Profile Settings'>
                    <Button variant={"ghost"} onClick={() => setOpenSettings(true)} className='focus-visible:ring-0 focus:none border-0 outline-none border-none focus:border-none focus:outline-none'>
                        <Settings />
                    </Button>
                </IconPopover>
                <div className="cursor-pointer hover:opacity-75 transition">
                    <IconPopover content={currentSessionUser.name!}>
                        <AvatarComp user={currentSessionUser} />
                    </IconPopover>
                </div>
            </nav>
            {
                openSettings && (
                    <SettingsModal open={openSettings} onOpenChange={() => setOpenSettings(false)} />
                )
            }
        </div>
    )
}

export default DeskTopSidebar