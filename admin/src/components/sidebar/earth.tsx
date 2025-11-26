"use client";

import React, { useEffect, useState } from "react";
import { ScrollShadow } from "@heroui/react";
import Sidebar from "./sidebar";
import { items } from "./sidebar-items";
import { User } from "../../types";
import { authAPI } from "../../services/api";

interface SideBarLayoutProps {
  children?: React.ReactNode;
}

export default function SideBarLayout({ children }: SideBarLayoutProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authAPI.getProfile();
        setUser(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="h-full min-h-192 flex">
      {/* Sidebar panel */}
      <div className="border-r-small border-divider h-full w-72 p-6">
        <div className="flex items-center gap-2 px-2">
          <div className="bg-foreground flex h-8 w-8 items-center justify-center rounded-full overflow-hidden">
            <img src="https://scontent.fbkk12-6.fna.fbcdn.net/v/t39.30808-6/587995936_2203132776881265_8249596491132280791_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEc5_biUAWu4CEhZtbhcHgUKWjJ341XC_0paMnfjVcL_Vhd2TAvKMh786cyKfj6Vn7t_BEwQKXPeetUxr2pHNDa&_nc_ohc=6_96vkTqf6oQ7kNvwHzv6j-&_nc_oc=AdnRHURTIXLDKRe1T0dZqj4hupjXt8hDgSE7rZjywIzrr1Q1Ysn3YdLBy2sYd7ngYfXkpgFQ1s_eW7NZgpc3-JCd&_nc_zt=23&_nc_ht=scontent.fbkk12-6.fna&_nc_gid=PZ12q5T5t_0HMIhq3rYsYA&oh=00_Afg_pf8cJELfFdr1-xcPoFNTzBxrnJdAQDtMOTCnknyRHw&oe=692CF79D"></img>
          </div>

          <span className="text-small font-bold uppercase">
            {user ? user.role.name : "Loading..."}
          </span>
        </div>

        <ScrollShadow className="h-full max-h-full py-[10vh] ">
          <Sidebar defaultSelectedKey="home" items={items} />
        </ScrollShadow>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">{children}</div>
    </div>
  );
}
