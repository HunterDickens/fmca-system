"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useEffect } from "react"
import axios from "@/axios/axiosInstance"

const profileFormSchema = z.object({
  firstName: z.string().max(50).min(2, { message: "This field is required." }),
  lastName: z.string().max(50).min(2, { message: "This field is required." }),
  email: z.string().min(1, { message: "This field is required." }).email("Invalid email."),
})

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters."),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PasswordFormValues = z.infer<typeof passwordFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  firstName: "Milo",
  lastName: "Sedarat",
  email: "admin@fmcafilings.com",
}

const defaultPasswordValues: Partial<PasswordFormValues> = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

export function ProfileForm() {
  const { toast } = useToast()

  // First form: Profile
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Second form: Password
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: defaultPasswordValues,
    mode: "onChange",
  })

  async function onSubmitProfile(data: ProfileFormValues) {
    const response = await axios.post("/profile/update", data)
    if (response.status === 201) {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        variant: "info"
      })
    }
  }

  async function onSubmitPassword(data: PasswordFormValues) {
    await axios.post("/profile/change-password", data).then((response) => {
      if (response.status === 200) {
        toast({
          title: "Password changed",
          description: "Your password has been updated successfully.",
          variant: "info"
        })
        passwordForm.reset()
      }
    }).catch((error) => {
      toast({
        title: "Authentication Error",
        description: "The current password you entered is incorrect.",
        variant: "destructive"
      })
    })
  }

  useEffect(() => {
    axios.get("/profile/get").then((response) => {
      if (response.status === 200) {
        profileForm.reset({
          firstName: response.data.profile.firstName,
          lastName: response.data.profile.lastName,
          email: response.data.profile.email
        })
      }
    })
  }, [])

  return (
    <div className="flex justify-between gap-8">
      {/* First Form - Profile */}
      <div className="w-1/2">
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-8">
            <FormField
              control={profileForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormDescription>Your email address is used for login and notifications.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="dark:text-white">Update Profile</Button>
          </form>
        </Form>
      </div>

      <div className="w-1/2">
        {/* Second Form - Password Change */}
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-8">
            <FormField
              control={passwordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Current Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="New Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm Password" {...field} />
                  </FormControl>
                  <FormDescription>You can change your password if you enter your current password correctly.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="dark:text-white">Change Password</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
