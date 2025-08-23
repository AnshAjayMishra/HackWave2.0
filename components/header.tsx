"use client"

import type React from "react"
import { useUser } from "@/contexts/user-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const { user, isAuthenticated, logout } = useUser()
  
  const navItems = [
    { name: "Features", href: "#features-section" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Benefits", href: "#benefits" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="w-full py-4 px-6 bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-foreground text-xl font-semibold hover:text-primary transition-colors">
              Janvaani
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-muted-foreground hover:text-foreground px-4 py-2 rounded-full font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href="/dash">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium shadow-sm">
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    Welcome back!
                  </Badge>
                  <span className="text-sm text-muted-foreground">{user?.name}</span>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-border hover:bg-muted">
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" className="px-6 py-2 rounded-full font-medium border-border hover:bg-muted">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium shadow-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
          
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-background border-t border-border">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-muted-foreground hover:text-foreground justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link href="/dash" className="w-full">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium shadow-sm w-full">
                        Dashboard
                      </Button>
                    </Link>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="text-sm bg-primary text-primary-foreground">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-foreground">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="w-full border-border hover:bg-muted">
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="px-6 py-2 rounded-full font-medium w-full border-border hover:bg-muted">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full font-medium shadow-sm w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
