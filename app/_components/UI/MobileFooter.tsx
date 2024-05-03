"use client"
import { useConversation } from '@/shared/hooks/useConversation'
import { useRoute } from '@/shared/hooks/useRoute'
import React from 'react'
import MobileItem from './MobileItem'

const MobileFooter = () => {

    const routes = useRoute()
    const { isOpen } = useConversation()

    if (isOpen) return null;

    return (
        <div className="fixed justify-between w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden p-2 border-gray-200">
            {
                routes.map((route) => (
                    <MobileItem key={route.label} {...route} />
                ))
            }
        </div>
    )
}

export default MobileFooter