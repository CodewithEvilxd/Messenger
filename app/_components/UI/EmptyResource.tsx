"use client"
import React from 'react'
import Image from 'next/image'
import { Button } from '@/shared/components/ui/button'
import { SuccessNotification } from '@/shared/lib/AxiosApiResNotification'

interface EmptyResourceProps {
    image : string,
    heading : string,
    message : string,
    fromUsers ?: boolean
}

const EmptyResource = ({heading ,image ,message , fromUsers}: EmptyResourceProps) => {

    const copyDomainToClipboard = () => {
        navigator.clipboard.writeText(process.env.NEXT_PUBLIC_WEBSITE_LINK!)
        SuccessNotification("Application link copied 👍🏻")
    }

  return (
      <div className="flex flex-col items-center justify-center bg-slate-50 shadow-sm rounded-lg px-3 py-5 space-y-4 my-auto">
          <Image src={image} width={100} height={100} className="size-20 object-cover" alt="User" />
          <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-neutral-900">
                {heading}
              </span>
              <p className="text-center mt-4">
                {message}
              </p>
              {
                fromUsers && (
                      <Button className='mt-7 w-full' onClick={copyDomainToClipboard}>
                          Copy Link
                      </Button>
                )
              }
          </div>
      </div>
  )
}

export default EmptyResource