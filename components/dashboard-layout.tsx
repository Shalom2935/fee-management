"use client"

import type React from "react"

import { useState, useEffect } from "react" // Added useEffect
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" // Added useRouter
import { Home, CreditCard, History, Settings, Users, LogOut, BarChart3, FileText, UserCog, Menu, X } from "lucide-react"
import { useAuth } from "@/components/auth-context" // Import useAuth

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Remove userType prop, get it from context
interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter();
  const { user, logout, isLoading: isAuthLoading, token } = useAuth(); // Get user, logout, loading state, and token from context

  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!isAuthLoading && !token) {
      router.push('/');
    }
  }, [isAuthLoading, token, router]);

  // // Show loading state or null while checking auth or if no user


  // Remove the open state since sidebar will be permanent
  // const [open, setOpen] = useState(true)

  const studentMenuItems = [
    {
      title: "Tableau de bord",
      icon: Home,
      href: "/etudiant",
    },
    {
      title: "Soumettre un paiement",
      icon: CreditCard,
      href: "/etudiant/paiements",
    },
    {
      title: "Historique des paiements",
      icon: History,
      href: "/etudiant/historique",
    },
    {
      title: "Paramètres du compte",
      icon: Settings,
      href: "/etudiant/parametres",
    },
  ]

  const adminMenuItems = [
    {
      title: "Tableau de bord",
      icon: Home,
      href: "/admin",
    },
    {
      title: "Paiements en attente",
      icon: CreditCard,
      href: "/admin/paiements",
    },
    {
      title: "Historique des paiements",
      icon: History,
      href: "/admin/historique",
    },
    {
      title: "Gestion des étudiants",
      icon: Users,
      href: "/admin/etudiants",
    },
    {
      title: "Gestion des sous-administrateurs",
      icon: UserCog,
      href: "/admin/sous-admins",
    },
    {
      title: "Paramètres",
      icon: Settings,
      href: "/admin/parametres",
    },
  ]

  const sousAdminMenuItems = [
    {
      title: "Tableau de bord",
      icon: Home,
      href: "/sous-admin",
    },
    {
      title: "Paiements en attente",
      icon: CreditCard,
      href: "/sous-admin/paiements",
    },
    {
      title: "Historique des paiements",
      icon: History,
      href: "/sous-admin/historique",
    },
    {
      title: "Paramètres",
      icon: Settings,
      href: "/sous-admin/parametres",
    },
  ]

  // Determine menu items based on user role from context
  const menuItems =
    user?.role === "student" ? studentMenuItems : adminMenuItems;
    // Note: Sous-admin logic needs adjustment if it's a separate role in your backend/context

  // Map English role to French path segment
  const rolePathSegment = user?.role === 'student' ? 'etudiant' : 'admin';

  // const userName = userType === "etudiant" ? "Jean Dupont" : userType === "admin" ? "Admin Principal" : "Sous-Admin"
  // Use user.name, user.email or user.matricule from context if available
  const userName = user?.name || (user?.role === 'student' ? user?.matricule : user?.email) || 'Utilisateur';

  // const userInfo =
  //   userType === "etudiant" ? "Matricule: 12345" : userType === "admin" ? "Administrateur" : "Sous-Administrateur"

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar - hidden on mobile */}
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="flex h-14 items-end justify-center border-b">
            {/* Remove the sidebar trigger since it's now permanent */}
            <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                        <Link href={item.href} className="flex items-center gap-2 w-full">
                          <item.icon className={item.title === "Déconnexion" ? "text-red-600" : "text-blue-600"} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {/* Logout Button - separate from dynamic items */}
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={logout} tooltip="Déconnexion" className="w-full">
                      <div className="flex items-center gap-2 w-full">
                        <LogOut className="text-red-600" />
                        <span>Déconnexion</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {/* Remove the SidebarFooter completely */}
        </Sidebar>
        <SidebarInset className="p-4 md:p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              {/* Use rolePathSegment for path comparisons */}
              <h1 className="text-xl md:text-2xl font-bold text-blue-900"> {/* Responsive font size */}
                {pathname === `/${rolePathSegment}` && "Tableau de bord"}
                {pathname === `/${rolePathSegment}/paiements` && "Paiements"}
                {pathname === `/${rolePathSegment}/historique` && "Historique des paiements"}
                {pathname === `/${rolePathSegment}/parametres` && "Paramètres"}
                {pathname === `/${rolePathSegment}/etudiants` && "Gestion des étudiants"} {/* Admin only */}
                {pathname === `/${rolePathSegment}/sous-admins` && "Gestion des sous-administrateurs"} {/* Admin only */}
              </h1>
              <p className="text-muted-foreground">
                {pathname === `/${rolePathSegment}` && user?.role !== "student" && "Bienvenue sur votre tableau de bord"}
                {pathname === `/${rolePathSegment}/paiements` && user?.role === "student"
                  ? "Soumettre un nouveau paiement"
                  : pathname === `/${rolePathSegment}/paiements` && "Paiements en attente d'approbation"}
                {pathname === `/${rolePathSegment}/historique` && "Consultez l'historique des paiements"}
                {pathname === `/${rolePathSegment}/parametres` && "Gérez les paramètres de votre compte"}
                {pathname === `/${rolePathSegment}/etudiants` && "Gérez les comptes étudiants"} {/* Admin only */}
                {pathname === `/${rolePathSegment}/sous-admins` && "Gérez les comptes des sous-administrateurs"} {/* Admin only */}
              </p>
            </div>

            {/* Mobile menu button - visible only on mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0">
                <SheetHeader className="h-14 flex items-end justify-center border-b p-4">
                  <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                  </div>
                </SheetHeader>
                <div className="py-4">
                  {menuItems.map((item) => (
                    // Use SheetClose for navigation items to close the sheet on click
                    // <SheetClose asChild key={item.href}>
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 ${
                          pathname === item.href ? "bg-blue-50 text-blue-700 font-medium" : ""
                        }`}
                      >
                        <item.icon className={`h-5 w-5 text-blue-600`} />
                        <span>{item.title}</span>
                      </Link>
                    // </SheetClose>
                  ))}
                  {/* Logout Button for Mobile Sheet */}
                  <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 w-full text-left">
                    <LogOut className="h-5 w-5 text-red-600" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
