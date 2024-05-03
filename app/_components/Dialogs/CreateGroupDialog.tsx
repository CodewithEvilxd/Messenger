"use client";
import * as React from "react";
import { Users, X } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandItem,
} from "@/shared/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { User } from "@prisma/client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"
import { createGroupFormSchema, createGroupFormSchemaType } from "../Forms/create-group-form";
import AvatarComp from "../UI/AvatarComp";
import { PromiseNotification } from "@/shared/lib/AxiosApiResNotification";
import axios from "axios";

export function CreateGroupDialog({ users }: { users: User[] }) {

    const [open, setOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [selected, setSelected] = React.useState<User[]>([]);
    const [inputValue, setInputValue] = React.useState("");

    const groupMemberFormDefaultValue = {
        name: "",
        members: []
    }

    const groupMemberForm = useForm<z.infer<createGroupFormSchemaType>>({
        resolver: zodResolver(createGroupFormSchema),
        defaultValues: groupMemberFormDefaultValue
    })

    async function onSubmit(values: z.infer<createGroupFormSchemaType>) {
        const formattedIds = values.members.map(ele => ({ value: ele }))
        PromiseNotification(
            axios.post("/api/conversations", { name: values.name, members: formattedIds, isGroup: true }),
            "Group created successfully!",
            () => {
                setSelected([])
                setInputValue("")
                setOpen(false)
                groupMemberForm.reset()
            }
        )
    }

    const handleUnselect = React.useCallback((framework: User) => {
        setSelected(prev => prev.filter(s => s.email !== framework.email));
    }, []);

    const selectables = users.filter(user => !selected.includes(user));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="space-x-3">
                    <Users className="ml-2 shrink-0 opacity-50 size-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] px-4 pt-4 pb-1  bg-white mt-1" side="right" sideOffset={30}>
                <span className="font-bold text-xl">Create Group</span>
                <div className="mb-2 mt-2">
                    <Form {...groupMemberForm}>
                        <form onSubmit={groupMemberForm.handleSubmit(onSubmit)}>
                            <div className="flex flex-col space-y-3">
                                <FormField
                                    control={groupMemberForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="Group name" {...field} />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={groupMemberForm.control}
                                    name="members"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="flex flex-col space-y-3 w-full">
                                                    <span className="mt-4 text-sm font-medium text-neutral-900">Select Users</span>
                                                    <Command className="overflow-visible bg-white mb-3 mt-1 w-full">
                                                        <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 w-full">
                                                            <div className="flex gap-1 flex-wrap w-full">
                                                                {selected.map((user) => {
                                                                    return (
                                                                        <Badge key={user.email} variant="secondary">
                                                                            {user.name}
                                                                            <button
                                                                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                                                                onClick={() => {
                                                                                    handleUnselect(user)
                                                                                    const removedFieldFromForm = field.value.filter((ele) => ele !== user.id)
                                                                                    field.onChange(removedFieldFromForm)
                                                                                }}>
                                                                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                                                            </button>
                                                                        </Badge>
                                                                    )
                                                                })}
                                                                <CommandPrimitive.Input
                                                                    ref={inputRef}
                                                                    value={inputValue}
                                                                    onValueChange={setInputValue}
                                                                    onBlur={() => setOpen(false)}
                                                                    onFocus={() => setOpen(true)}
                                                                    placeholder="Select user..."
                                                                    className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                                                                />
                                                            </div>
                                                        </div>
                                                        {
                                                            selectables.length > 0 && (
                                                                <div className="w-full z-10 rounded-md border bg-popover text-popover-foreground  outline-none animate-in mt-2 max-h-[500px] overflow-y-auto">
                                                                    <CommandGroup className="h-full overflow-auto">
                                                                        {selectables.map((user) => {
                                                                            return (
                                                                                <CommandItem
                                                                                    key={user.email}
                                                                                    onSelect={(value) => {
                                                                                        setInputValue("")
                                                                                        field.onChange([...field.value, user.id])
                                                                                        setSelected(prev => [...prev, user])
                                                                                    }}
                                                                                    className={"cursor-pointer"}
                                                                                >
                                                                                    <div className="flex items-center space-x-3">
                                                                                        <AvatarComp user={user} />
                                                                                        <div className="flex flex-col pr-4 w-full ">
                                                                                            <span className="text-md  font-bold text-neutral-950 caption-top">{user.name}</span>
                                                                                            <span className="text-[13px] w-[80%] truncate font-normal text-gray-700">{user.email}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </CommandItem>
                                                                            );
                                                                        })}
                                                                    </CommandGroup>
                                                                </div>
                                                            )
                                                        }
                                                    </Command >
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    size={"sm"}
                                    className="bg-messangerBlue hover:bg-blue-600"
                                    disabled={groupMemberForm.formState.isSubmitting}
                                >Create Group</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </PopoverContent>
        </Popover>
    )
}