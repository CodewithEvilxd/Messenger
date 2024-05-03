import React from 'react'
import { Loader } from "lucide-react"

const Loading = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <Loader className='animate-spin text-messangerBlue transition-all' />
        </div>
    )
}

export default Loading