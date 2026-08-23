import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
  } from "@/components/ui/sidebar"
import Link from "next/link";
import Image from "next/image";
  
  export function AppSidebar() {
    return (
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup >
            <SidebarContent>Bana rha hu bhai ruk ja.</SidebarContent>
            <SidebarContent><Link href="https://www.instagram.com/reel/DJFJBltBMKH/" target="_blank"><Image src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLnMPQzp5N3S90cm15HzSROX0zPUdqKy31IRIR-fqgL5grcjv1EPqkdQnP&s=10" alt="Instagram" width={300} height={50} className="rounded-sm"/></Link></SidebarContent>
            </SidebarGroup>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    )
  }