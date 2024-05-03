import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Loader className="animate-spin text-messangerBlue" />
        </div>
    )
}
export default Loading