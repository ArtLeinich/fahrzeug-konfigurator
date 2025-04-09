"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Menu,
  X,
  Car,
  Home,
  Settings,
  ShoppingCart,
  Users,
  ClipboardList,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const verwaltungPath =
    session?.user?.role === "ADMIN"
      ? "/admin/bestellverwaltung"
      : "/verwaltung";
  const verwaltungText =
    session?.user?.role === "ADMIN" ? "Bestellverwaltung" : "Kaufverwaltung";
  const VerwaltungIcon =
    session?.user?.role === "ADMIN" ? ClipboardList : ShoppingCart;


  const getAvatarInitials = () => {
    if (session?.user?.firstName && session?.user?.lastName) {
      return (
        session.user.firstName.charAt(0) + session.user.lastName.charAt(0)
      );
    }

    else if (session?.user?.name) {
      return session.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .substring(0, 2);
    }
   
    return session?.user?.email?.charAt(0) || "U";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo und Seitentitel */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-display font-semibold">
              Fahrzeugkonfigurator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                isActive("/")
                  ? "bg-secondary text-primary font-medium"
                  : "hover:bg-secondary/50"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Startseite</span>
            </Link>
            <Link
              href="/katalog"
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                isActive("/katalog")
                  ? "bg-secondary text-primary font-medium"
                  : "hover:bg-secondary/50"
              }`}
            >
              <Car className="h-4 w-4" />
              <span>Fahrzeugkatalog</span>
            </Link>
            <Link
              href="/konfigurator"
              className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                isActive("/konfigurator")
                  ? "bg-secondary text-primary font-medium"
                  : "hover:bg-secondary/50"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Konfigurator</span>
            </Link>
            {session && (
              <Link
                href={verwaltungPath}
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                  isActive(verwaltungPath)
                    ? "bg-secondary text-primary font-medium"
                    : "hover:bg-secondary/50"
                }`}
              >
                <VerwaltungIcon className="h-4 w-4" />
                <span>{verwaltungText}</span>
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin/kunden"
                className={`px-3 py-2 rounded-md transition-colors flex items-center space-x-1 ${
                  isActive("/admin/kunden")
                    ? "bg-secondary text-primary font-medium"
                    : "hover:bg-secondary/50"
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Kundenverwaltung</span>
              </Link>
            )}
            <div>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-8 w-8 rounded-full flex items-center justify-center mx-auto">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getAvatarInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem asChild>
                      <Link href="/profil" onClick={toggleMenu}>
                        Mein Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        signOut({ callbackUrl: "/login" });
                        toggleMenu();
                      }}
                    >
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" onClick={toggleMenu}>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full flex items-center justify-center space-x-2">
                    <UserCircle className="h-4 w-4" />
                    <span>Anmelden</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-1">
            <Link
              href="/"
              className={`py-2 px-3 rounded-md flex items-center space-x-2 ${
                isActive("/") ? "bg-secondary text-primary font-medium" : ""
              }`}
              onClick={toggleMenu}
            >
              <Home className="h-5 w-5" />
              <span>Startseite</span>
            </Link>
            <Link
              href="/katalog"
              className={`py-2 px-3 rounded-md flex items-center space-x-2 ${
                isActive("/katalog")
                  ? "bg-secondary text-primary font-medium"
                  : ""
              }`}
              onClick={toggleMenu}
            >
              <Car className="h-5 w-5" />
              <span>Fahrzeugkatalog</span>
            </Link>
            <Link
              href="/konfigurator"
              className={`py-2 px-3 rounded-md flex items-center space-x-2 ${
                isActive("/konfigurator")
                  ? "bg-secondary text-primary font-medium"
                  : ""
              }`}
              onClick={toggleMenu}
            >
              <Settings className="h-5 w-5" />
              <span>Konfigurator</span>
            </Link>
            {session && (
              <Link
                href={verwaltungPath}
                className={`py-2 px-3 rounded-md flex items-center space-x-2 ${
                  isActive(verwaltungPath)
                    ? "bg-secondary text-primary font-medium"
                    : ""
                }`}
                onClick={toggleMenu}
              >
                <VerwaltungIcon className="h-5 w-5" />
                <span>{verwaltungText}</span>
              </Link>
            )}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin/kunden"
                className={`py-2 px-3 rounded-md flex items-center space-x-2 ${
                  isActive("/admin/kunden")
                    ? "bg-secondary text-primary font-medium"
                    : ""
                }`}
                onClick={toggleMenu}
              >
                <Users className="h-5 w-5" />
                <span>Kundenverwaltung</span>
              </Link>
            )}
            <div className="pt-2 mt-2 border-t border-border">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="relative h-8 w-8 rounded-full flex items-center justify-center mx-auto">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getAvatarInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center">
                    <DropdownMenuItem asChild>
                      <Link href="/profil" onClick={toggleMenu}>
                        Mein Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        signOut({ callbackUrl: "/login" });
                        toggleMenu();
                      }}
                    >
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login" onClick={toggleMenu}>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full flex items-center justify-center space-x-2">
                    <UserCircle className="h-4 w-4" />
                    <span>Anmelden</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}