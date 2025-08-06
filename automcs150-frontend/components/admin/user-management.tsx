"use client"

import { useEffect, useState } from "react"
import { Edit, MoreHorizontal, Plus, Trash, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import axios from "@/axios/axiosInstance"
import moment from "moment"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { GenericPaginatedTable, type ColumnDef } from "@/components/ui/generic-paginated-table"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  isAdmin: boolean
  createdAt: string
  lastLogin: string
  status: number
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getRoleBadgeColor = (role: User["isAdmin"]) => {
  switch (role) {
    case true:
      return "bg-purple-100 text-purple-800 hover:bg-purple-100"
    case false:
      return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

// Get status badge color
const getStatusBadgeColor = (status: User["status"]) => {
  switch (status) {
    case 1:
      return "text-white bg-green-500 hover:bg-green-600"
    case 0:
      return "text-white bg-red-500 hover:bg-green-600"
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100"
  }
}

export function UserManagement() {
  const [users, setUsers] = useState<User[] | null>([])
  const { toast } = useToast()
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add user logic would go here
    setIsSubmitting(true)
    await axios.post("/user/add_user", {
      user: {
        ...currentUser,
        password
      }
    }).then((response) => {
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "The user was added successfully.",
          variant: "info",
        })
        fetchUsers();
      }
    }).catch((error) => {
      toast({
        title: "Error",
        description: "An error occurred while adding the user information.",
        variant: "destructive",
      })
    }).finally(() => {
      setIsAddUserOpen(false)
      setIsSubmitting(false)
    })
  }

  const handleInputChange = (field: string, value: any) => {
    setCurrentUser((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    // Edit user logic would go here
    setIsSubmitting(true)
    await axios.put("/user/update_user", {
      user: currentUser
    }).then((response) => {
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "User information updated successfully.",
          variant: "info",
        })
        fetchUsers();
      }
    }).catch((error) => {
      toast({
        title: "Error",
        description: "An error occurred while updating the user information.",
        variant: "destructive",
      })
    }).finally(() => {
      setIsEditUserOpen(false)
      setIsSubmitting(false)
    })
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSubmitting(true)
    await axios.put("/user/reset_password", {
      user: {
        id: currentUser?.id,
        password: password
      }
    }).then((response) => {
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "The password was updated successfully.",
          variant: "info",
        })
      }
    }).catch((error) => {
      toast({
        title: "Error",
        description: "An error occurred while updating the password.",
        variant: "destructive",
      })
    }).finally(() => {
      setIsResetPasswordOpen(false)
      setIsSubmitting(false)
    })
  }

  const openResetPasswordDialog = (user: User) => {
    setPassword("")
    setConfirmPassword("")
    setCurrentUser(user)
    setIsResetPasswordOpen(true)
  }

  const handleDeleteUser = async () => {
    // Delete user logic would go here
    setIsSubmitting(true)
    await axios.post("/user/delete_user", {
      user: {
        id: currentUser?.id
      }
    }).then((response) => {
      if (response.status === 200) {
        toast({
          title: "Success",
          description: "The user was deleted successfully.",
          variant: "info",
        })
        fetchUsers()
      }
    }).catch((error) => {
      toast({
        title: "Error",
        description: "An error occurred while deleteing the user.",
        variant: "destructive",
      })
    }).finally(() => {
      setIsDeleteUserOpen(false)
      setIsSubmitting(false)
    })
  }

  const openEditDialog = (user: User) => {
    setCurrentUser(user)
    setIsEditUserOpen(true)
  }

  const openDeleteDialog = (user: User) => {
    setCurrentUser(user)
    setIsDeleteUserOpen(true)
  }

  const openAddDialog = (open: boolean) => {
    setPassword("")
    setCurrentUser({
      id: "",
      firstName: "",
      lastName: "",
      lastLogin: "",
      createdAt: "",
      email: "",
      isAdmin: false,
      status: 0
    })
    setIsAddUserOpen(open)
  }

  const fetchUsers = async () => {
    await axios.get(`/user/get_users`).then((response) => {
      if (response.status === 200) {
        setUsers(response.data.users)
      }
    })
  }

  const columns: ColumnDef<User>[] = [
    {
      header: "Name",
      cell: (user) => (
        <div className="flex items-center space-x-3">
          <div>{user.firstName} {user.lastName}</div>
        </div>
      ),
    },
    {
      header: "Email",
      cell: (user) => (
        <div className="flex items-center space-x-3">
          <div>{user.email}</div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (user) => (
        <Badge
          variant={user.isAdmin === true ? "default" : "destructive"}
          className={user.isAdmin === true ? "text-white bg-blue-500 hover:bg-blue-600" : "bg-pink-500"}
        >
          {user.isAdmin === true ? "Admin" : "User"}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (user) => (
        <Badge
          variant={user.status === 1 ? "default" : "destructive"}
          className={user.status === 1 ? "text-white bg-green-500 hover:bg-green-600" : ""}
        >
          {user.status === 1 ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      header: "Created At",
      cell: (user) => moment(user.createdAt).isValid() ? moment.utc(user.createdAt).format('MM/DD/YYYY hh:mm A') : "",
    },
    {
      header: "Last Login",
      cell: (user) => moment(user.createdAt).isValid() ? moment.utc(user.lastLogin).format('MM/DD/YYYY hh:mm A') : "",
    },
    {
      header: "Actions",
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openEditDialog(user)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => openResetPasswordDialog(user)}>
              <UserCog className="mr-2 h-4 w-4" />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive dark:text-red-500" onClick={() => openDeleteDialog(user)}>
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "text-right",
    },
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={openAddDialog}>
          <DialogTrigger asChild>
            <Button className="dark:text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="First Name" onChange={(e) => handleInputChange("firstName", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Last Name" onChange={(e) => handleInputChange("lastName", e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Email" onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => handleInputChange("isAdmin", value === "admin")} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => handleInputChange("status", parseInt(value, 10))} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="0">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    className="focus:border-[#1e3a8a] focus:ring-[#1e3a8a] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pt-4"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="dark:text-white">
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                      Creating User...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Create User
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <GenericPaginatedTable
          data={users || []}
          columns={columns}
          keyExtractor={(user) => user.id}
          emptyMessage="No users found"
        />
      </CardContent>
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editFirstName">First Name</Label>
                  <Input id="editFirstName" placeholder="First Name" defaultValue={currentUser?.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editLastName">Last Name</Label>
                  <Input id="editLastName" placeholder="Last Name" defaultValue={currentUser?.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editEmail">Email</Label>
                <Input id="editEmail" type="email" placeholder="Email" defaultValue={currentUser?.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole">Role</Label>
                <Select defaultValue={currentUser?.isAdmin?.toString()} onValueChange={(value) => handleInputChange("isAdmin", value == 'true')} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Admin</SelectItem>
                    <SelectItem value="false">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editStatus">Status</Label>
                <Select defaultValue={currentUser?.status?.toString()} onValueChange={(value) => handleInputChange("status", parseInt(value, 10))} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Active</SelectItem>
                    <SelectItem value="0">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="hover:bg-blue-900-light">
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Saving Changes...
                  </span>
                ) : (
                  <span className="flex items-center dark:text-white">
                    Save Changes
                  </span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              {isSubmitting ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center">
                  Delete
                </span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              {currentUser && `Reset password for ${currentUser.firstName} ${currentUser.lastName}.`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" value={password}
                  onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
                Cancel
              </Button>
              <Button className="dark:text-white" type="submit">
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                    Resetting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Reset Password
                  </span>
                )}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
