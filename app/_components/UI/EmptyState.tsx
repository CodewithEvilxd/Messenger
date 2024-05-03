"use client"
import { usePathname } from 'next/navigation'
import React from 'react'

const EmptyState = () => {

    const pathName = usePathname()

    return (
        <div className="h-full w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <p className="text-4xl sm:text-6xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-900  to-neutral-500 py-8">
                {
                    pathName === "/users" ? (
                        <p className='text-center'>Click User & Create<br /> Conversation</p>
                    ) : (
                        <span>Select Conversation</span>
                    )
                }
            </p>
        </div>
    )
}

export default EmptyState