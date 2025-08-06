import { UserManagement } from "@/components/admin/user-management"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
      </div>
      <UserManagement />
    </div>
  )
}
