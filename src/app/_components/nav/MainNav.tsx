"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RulesDialog from "../dialog/RulesDialog";
import PuntoBanner from "../PuntoBanner";

//inspired by https://github.com/shadcn-ui/ui/blob/a465432a664ab41b36bca970fdcad2341c873f6d/apps/www/components/main-nav.tsx

export default function MainNav() {
  const pathname = usePathname();
  return (
    <div className="w-full flex items-center text-lg mt-2 mx-1">
      {pathname !== "/" && (
        <Link href="/" >
        <PuntoBanner className="p-1 text-lg"/>
        </Link>
      )}
      <nav className="w-full flex items-center justify-end gap-6 mx-1">

        <RulesDialog width={20} height={20} className="mr-2"></RulesDialog>
      </nav>
    </div>
  );
}
