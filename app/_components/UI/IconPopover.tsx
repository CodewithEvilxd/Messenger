"use client"
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"

const IconPopover = ({ children, content }: { content: string, children: React.ReactNode }) => {

    const [open, setOpen] = useState(false);
    const handleMouseEnter = () => {
        setOpen(true);
    };
    const handleMouseLeave = () => {
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className='outline-none'
            >
                {children}
            </PopoverTrigger>
            <PopoverContent side='right' sideOffset={20} className='max-w-fit font-bold text-neutral-900 border-2'>{content}</PopoverContent>
        </Popover>

    )
}

export default IconPopover