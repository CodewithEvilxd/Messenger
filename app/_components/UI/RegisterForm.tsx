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

interface RegisterFormProps {
    onSubmit: (values: z.infer<registerFormSchemaType | loginFormSchemaType>) => void,
    registerForm: UseFormReturn<{
        name: string;
        email: string;
        password: string;
    }, any, undefined>,
    makeItDisable: boolean
}

const RegisterForm = ({ registerForm, onSubmit, makeItDisable }: RegisterFormProps) => {
    return (
        <Form {...registerForm}>
            <form onSubmit={registerForm.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="mark hokins" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={registerForm.control}
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
                <Button type="submit" className='w-full bg-messangerBlue hover:bg-sky-700' disabled={registerForm.formState.isSubmitting || makeItDisable}>
                    Sign Up
                </Button>
            </form>
        </Form>
    )
}

export default RegisterForm