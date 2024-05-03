"use client"
import { loginFormSchema, loginFormSchemaType } from '../_components/Forms/login-form'
import { registerFormSchema, registerFormSchemaType } from '../_components/Forms/register-form'
import { Separator } from '@/shared/components/ui/separator'
import RegisterForm from '../_components/UI/RegisterForm'
import { Button } from '@/shared/components/ui/button'
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useCallback, useEffect, useState } from 'react'
import LoginForm from '../_components/UI/LoginForm'
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form"
import { FaGithub } from "react-icons/fa";
import Image from 'next/image'
import axios from "axios"
import { z } from "zod"
import { PromiseNotification } from '../../shared/lib/AxiosApiResNotification'
import { signIn, useSession } from "next-auth/react"
import toast from 'react-hot-toast'
import { useRouter } from "next13-progressbar"

const Home = () => {

    const [variant, setVariant] = useState<"LOGIN" | "REGISTER">("LOGIN")
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const session = useSession()

    const toggleVariant = useCallback(() => {
        if (variant === "LOGIN") {
            loginForm.reset()
            setVariant("REGISTER")
        } else {
            registerForm.reset()
            setVariant("LOGIN")
        }
    }, [variant])


    const loginFormDefaultValue = {
        email: "",
        password: ""
    }

    const registerFormDefaultValue = {
        name: "",
        email: "",
        password: ""
    }

    const loginForm = useForm<z.infer<loginFormSchemaType>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: loginFormDefaultValue
    })

    const registerForm = useForm<z.infer<registerFormSchemaType>>({
        resolver: zodResolver(registerFormSchema),
        defaultValues: registerFormDefaultValue
    })

    const funcOnSuccess = () => {
        registerForm.reset()
        toggleVariant()
    }

    async function onSubmit(values: z.infer<registerFormSchemaType | loginFormSchemaType>) {
        if (variant === "LOGIN") {
            signIn("credentials", {
                ...values,
                redirect: false
            }).then((callBack) => {
                if (callBack?.ok) {
                    loginForm.reset()
                    router.push("/conversations")
                    toast.success("Signed In Successfully!")
                }
                if (callBack?.error) {
                    toast.error(callBack?.error)
                }
            })
        } else {
            const registerPromise = axios.post("/api/register", values)
            PromiseNotification(registerPromise, "You have been registered!", funcOnSuccess)
        }
    }

    const socialAction = (action: string) => {
        setLoading(true)
        signIn(action, {
            redirect: false
        }).then((callBack) => {
            if (callBack?.ok) {
                router.push("/conversations")
                toast.success("Signed In Successfully!")
            }
            if (callBack?.error) {
                toast.error(callBack?.error)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="flex min-h-full flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-white  sm:bg-gray-100 space-y-7">
            <div className='sm:bg-white px-6 py-8 rounded-xl sm:shadow-md sm:w-full sm:max-w-md md:max-w-lg space-y-6'>
                <div className="">
                    <Image alt="Logo" height={48} width={48} className="mx-auto w-auto" src="/logo.png" />
                    <h2 className="mt-3 text-center text-2xl font-bold tracking-tight text-neutral-800 capitalize">
                        {variant === "LOGIN" ? "Sign in to your account" : "Sign Up Your Account"}
                    </h2>
                </div>
                <div className="space-y-5">
                    {
                        variant === "LOGIN" ? (
                            <LoginForm onSubmit={onSubmit} loginForm={loginForm} makeItDisable={loading} />
                        ) : (
                            <RegisterForm onSubmit={onSubmit} registerForm={registerForm} makeItDisable={loading} />
                        )
                    }
                    <Separator />
                    <div className="w-full flex flex-row space-x-2">
                        <Button variant={"outline"} className="text-md space-x-3 w-1/2" onClick={() => socialAction("google")} disabled={loading}>
                            <FcGoogle size={22} />
                            <span>
                                Google
                            </span>
                        </Button>
                        <Button variant={"outline"} className="text-md space-x-3 w-1/2" onClick={() => socialAction("github")} disabled={loading}>
                            <FaGithub size={22} />
                            <span>
                                Github
                            </span>
                        </Button>
                    </div>
                    <div className="flex items-center justify-center space-x-4">
                        <Separator className="w-1/3" />
                        <span className="text-neutral-300">or</span>
                        <Separator className="w-1/3" />
                    </div>
                    <div className="w-full">
                        {
                            variant === "LOGIN" && (
                                <p className="flex items-center justify-center">
                                    <span className="text-neutral-800 font-light">
                                        Dont have a account?
                                    </span>
                                    <span className='text-messangerBlue underline underline-offset-4 text-sm ml-4 cursor-pointer' onClick={toggleVariant}>Sign Up</span>
                                </p>
                            )
                        }
                        {
                            variant === "REGISTER" && (
                                <p className="flex items-center justify-center">
                                    <span className="text-neutral-800 font-light">
                                        Already have a account?
                                    </span>
                                    <span className='text-messangerBlue underline underline-offset-4 text-sm ml-4 cursor-pointer' onClick={toggleVariant}>Sign In</span>
                                </p>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home