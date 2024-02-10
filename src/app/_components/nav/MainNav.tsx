"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

//inspired by https://github.com/shadcn-ui/ui/blob/a465432a664ab41b36bca970fdcad2341c873f6d/apps/www/components/main-nav.tsx

export default function MainNav() {
  const pathname = usePathname();
  return (
    <div className="flex items-center">
      {pathname !== "/" && (
        <Link href="/" className="mr-6">
          Punto Online
        </Link>
      )}
      <nav className="flex items-center gap-6 text-sm">
        <Link
          href="/about"
          className={cn(
            "transition-colors hover:text-foreground/80",
            pathname === "/about" ? "text-foreground" : "text-foreground/60"
          )}
        >
          About
        </Link>
      </nav>
    </div>
  );
}
