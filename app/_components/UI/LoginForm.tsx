import React from 'react'
import { loginFormSchemaType } from '../Forms/login-form'
import { registerFormSchemaType } from '../Forms/register-form'
import { z } from 'zod'
import { UseFormReturn } from 'react-hook-form'
import { Button } from "@/shared/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form"
import { Input } from "@/shared/components/ui/input"


interface LoginFormProps {
    onSubmit: (values: z.infer<registerFormSchemaType | loginFormSchemaType>) => void,
    loginForm: UseFormReturn<{
        email: string;
        password: string;
    }, any, undefined>,
    makeItDisable: boolean
}

const LoginForm = ({ loginForm, onSubmit, makeItDisable }: LoginFormProps) => {
    return (
        <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email ID</FormLabel>
                            <FormControl>
                                <Input placeholder="mark@meta.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className='w-full bg-messangerBlue hover:bg-sky-700' disabled={loginForm.formState.isSubmitting || makeItDisable}>
                    Sign In
                </Button>
            </form>
        </Form>
    )
}

export default LoginForm