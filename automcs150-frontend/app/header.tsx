import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import Cookies from 'universal-cookie'
import Link from "next/link"
import { Truck } from "lucide-react"
import { useEffect, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPopover } from "@/components/notifications-popover"
import { Settings, User, Activity } from "lucide-react"
import { parseAccessToken } from "@/lib/parse"
import { useTheme } from "next-themes"

export default function Header() {
    const router = useRouter()
    const { theme, setTheme } = useTheme()
    const cookies = new Cookies()
    const [isAdmin, setIsAdmin] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)

    const handleLogout = () => {
        cookies.remove("accesstoken", { path: '' })
        setTheme("light")
        localStorage.clear()
        router.push("/login")
    }

    const gotoAdmin = () => {
        router.push("/admin/dashboard")
    }

    const gotoProfile = () => {
        router.push("/profile")
    }

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken") || ''
        const user = parseAccessToken(accessToken);
        setIsAdmin(user?.isAdmin || false)
    }, [])

    return (
        <header className="bg-blue-900 text-white py-4 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* <h1 className="text-xl font-bold">FMCA Filings Dashboard</h1> */}
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-white">
                    <Truck className="h-6 w-6" />
                    <span className="text-xl">FMCA Filings Generator</span>
                </Link>
                <div className="flex items-center space-x-4">
                    <NotificationsPopover />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full border border-white/20 bg-blue-900-light h-8 w-8 text-white hover:bg-blue-900-light/80"
                            >
                                <User className="h-4 w-4" />
                                <span className="sr-only">User menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {
                                isAdmin && <DropdownMenuItem onClick={gotoAdmin}>
                                    <Activity className="mr-2 h-4 w-4" />
                                    Admin
                                </DropdownMenuItem>
                            }
                            <DropdownMenuItem onClick={gotoProfile}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}