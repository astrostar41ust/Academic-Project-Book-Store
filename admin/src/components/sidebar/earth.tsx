"use client";

import React from "react";
import { ScrollShadow } from "@heroui/react";
import Sidebar from "./sidebar";
import { AcmeIcon } from "./acme";
import { items } from "./sidebar-items";

interface SideBarLayoutProps {
  children?: React.ReactNode;
}

export default function SideBarLayout({ children }: SideBarLayoutProps) {
  return (
    <div className="h-full min-h-192 flex">
      {/* Sidebar panel */}
      <div className="border-r-small border-divider h-full w-72 p-6">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-full">
            <AcmeIcon className="text-background" />
          </div>
          <span className="text-small font-bold uppercase">Acme</span>
        </div>
        <ScrollShadow className="h-full max-h-full py-[10vh] bg-amber-100">
          <Sidebar defaultSelectedKey="home" items={items} />
        </ScrollShadow>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
}
