import React from 'react'
import DeskTopSidebar from './DeskTopSidebar'
import MobileFooter from './MobileFooter'

const SideBar = ({ children }: { children: React.ReactNode }) => {

    return (
        <div className="h-full w-full">
            <DeskTopSidebar />
            <MobileFooter />
            <main className="lg:pl-20 h-full ">
                {children}
            </main>
        </div>
    )
}

export default SideBar