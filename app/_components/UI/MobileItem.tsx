"use client"
import { cn } from '@/shared/lib/utils'
import Link from 'next/link'
import React from 'react'
import { IconType } from 'react-icons'

interface MobileItemProps {
    label: string,
    icon: IconType,
    href: string,
    onClick?: () => void,
    active?: boolean
}

const MobileItem = ({ href, icon: Icon, label, active, onClick }: MobileItemProps) => {

    const handleClick = () => {
        if (onClick) {
            return onClick()
        }
    }

    return (
        <Link href={href} className={cn(`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100 w-full justify-center`, active && "bg-gray-100 text-black")} onClick={handleClick}>
            <Icon className="size-6 shrink-0" />
            <span className="">{label}</span>
        </Link>
    )
}

export default MobileItem