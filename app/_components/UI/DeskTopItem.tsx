"use client"
import { cn } from '@/shared/lib/utils'
import Link from 'next/link'
import React from 'react'
import { IconType } from "react-icons"
import IconPopover from './IconPopover'

interface DeskTopItemProps {
    label: string,
    icon: IconType,
    href: string,
    onClick?: () => void,
    active?: boolean
}

const DeskTopItem = ({ href, icon: Icon, label, active, onClick }: DeskTopItemProps) => {

    const handleClick = () => {
        if (onClick) {
            return onClick()
        }
    }

    return (
        <li className="" onClick={handleClick}>
            <IconPopover content={label}>
                <Link href={href} className={cn(`group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100`, active && "bg-gray-100 text-black")}>
                    <Icon className="size-6 shrink-0" />
                    <span className="sr-only">{label}</span>
                </Link>
            </IconPopover>
        </li >
    )
}

export default DeskTopItem