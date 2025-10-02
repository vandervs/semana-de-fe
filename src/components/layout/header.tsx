
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Menu } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { label: "Mapa", href: "/" },
  { label: "Desafios", href: "/tasks" },
  { label: "Testemunhos", href: "/testimonies" },
  { label: "Sobre", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo-cru.png" alt="Logo Cru" width={24} height={24} className="h-6 w-6" />
            <span className="inline-block font-bold">Semana de Fé</span>
          </Link>
          {!isMobile && (
              <nav className="hidden gap-6 md:flex">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                      pathname === item.href ? "text-foreground" : "text-foreground/60"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
            {!isMobile ? (
                <Button asChild>
                    <Link href="/submit">Enviar Iniciativa</Link>
                </Button>
            ) : (
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Alternar Menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="right">
                    <Link href="/" className="mb-8 flex items-center" onClick={() => setIsSheetOpen(false)}>
                        <Image src="/logo-cru.png" alt="Logo Cru" width={24} height={24} className="mr-2 h-6 w-6" />
                        <span className="font-bold">Semana de Fé</span>
                    </Link>
                    <nav className="flex flex-col gap-6">
                        {[...navItems, {label: "Enviar Iniciativa", href: "/submit"}].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsSheetOpen(false)}
                            className={cn(
                            "text-lg font-medium transition-colors hover:text-foreground/80",
                            pathname === item.href ? "text-foreground" : "text-foreground/60"
                            )}
                        >
                            {item.label}
                        </Link>
                        ))}
                    </nav>
                    </SheetContent>
                </Sheet>
            )}
        </div>
      </div>
    </header>
  );
}
