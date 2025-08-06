import { Separator } from "@/components/ui/separator"
import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Update your personal information and reset your password here.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  )
}
