"use client"
import * as React from "react"
import { VenetianMask } from "lucide-react"
import { Button } from "@/shared/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/shared/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { User } from "@prisma/client"
import AvatarComp from "../UI/AvatarComp"

interface Props {
    seenUsersList: User[]
}

export function UserSeenList({ seenUsersList }: Props) {

    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="space-x-3 text-messangerBlue">
                    <VenetianMask className="ml-2 size-6 shrink-0 opacity-50 text-messangerBlue" />
                    <span className="text-xs">
                        Seen By
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0" side="left">
                <Command>
                    <CommandInput placeholder="Search User..." />
                    <CommandGroup>
                        {seenUsersList.map((user: User) => (
                            <CommandItem
                                key={user.id}
                                value={user.name!}
                                onSelect={(currentValue) => {
                                    setValue(currentValue === value ? "" : currentValue)
                                    setOpen(false)
                                }}>
                                <div className="w-full flex space-x-4 items-center">
                                    <AvatarComp user={user} />
                                    <div className="flex flex-col pr-4 w-full">
                                        <span className="text-md  font-bold text-neutral-950 caption-top">{user?.name}</span>
                                        <span className="text-[13px] truncate w-[98%] font-normal text-gray-700">{user?.email}</span>
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
