"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, History, Settings, Users, LogOut, BarChart3, FileText, UserCog, Menu, X } from "lucide-react"

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

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: "etudiant" | "admin" | "sous-admin"
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const pathname = usePathname()
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false) // State not needed for Sheet
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
    // Add logout at the end of navigation
    {
      title: "Déconnexion",
      icon: LogOut,
      href: "/logout",
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
    {
      title: "Déconnexion",
      icon: LogOut,
      href: "/logout",
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
    {
      title: "Déconnexion",
      icon: LogOut,
      href: "/logout",
    },
  ]

  const menuItems =
    userType === "etudiant" ? studentMenuItems : userType === "admin" ? adminMenuItems : sousAdminMenuItems

  // These user details might be better fetched from context/auth state later
  // const userTitle =
  //   userType === "etudiant"
  //     ? "Compte Étudiant"
  //     : userType === "admin"
  //       ? "Compte Administrateur"
  //       : "Compte Sous-Administrateur"

  // const userName = userType === "etudiant" ? "Jean Dupont" : userType === "admin" ? "Admin Principal" : "Sous-Admin"

  // const userInfo =
  //   userType === "etudiant" ? "Matricule: 12345" : userType === "admin" ? "Administrateur" : "Sous-Administrateur"

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar - hidden on mobile */}
        <Sidebar userType={userType} variant="sidebar" className="hidden md:flex">
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
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {/* Remove the SidebarFooter completely */}
        </Sidebar>
        <SidebarInset className="p-4 md:p-6 w-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-blue-900"> {/* Responsive font size */}
                {pathname === `/${userType}` && userType === "etudiant" ? "Tableau de bord" : pathname === `/${userType}` && "Tableau de bord"}
                {pathname === `/${userType}/paiements` && "Paiements"}
                {pathname === `/${userType}/historique` && "Historique des paiements"}
                {pathname === `/${userType}/parametres` && "Paramètres"}
                {pathname === `/${userType}/etudiants` && "Gestion des étudiants"}
                {pathname === `/${userType}/sous-admins` && "Gestion des sous-administrateurs"}
              </h1>
              <p className="text-muted-foreground">
                {pathname === `/${userType}` && userType !== "etudiant" && "Bienvenue sur votre tableau de bord"}
                {pathname === `/${userType}/paiements` && userType === "etudiant"
                  ? "Soumettre un nouveau paiement"
                  : pathname === `/${userType}/paiements` && "Paiements en attente d'approbation"}
                {pathname === `/${userType}/historique` && "Consultez l'historique de vos paiements"}
                {pathname === `/${userType}/parametres` && "Gérez les paramètres de votre compte"}
                {pathname === `/${userType}/etudiants` && "Gérez les comptes étudiants"}
                {pathname === `/${userType}/sous-admins` && "Gérez les comptes des sous-administrateurs"}
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
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 ${
                        pathname === item.href ? "bg-blue-50 text-blue-700 font-medium" : ""
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${item.title === "Déconnexion" ? "text-red-600" : "text-blue-600"}`} />
                      <span>{item.title}</span>
                    </Link>
                  ))}
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
