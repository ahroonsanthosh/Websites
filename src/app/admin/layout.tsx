"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home, UtensilsCrossed, Image, MapPin, Star, Search, Settings, LogOut, Menu, X, FileText
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/admin" },
  { icon: FileText, label: "Hero", href: "/admin/hero" },
  { icon: UtensilsCrossed, label: "Menu", href: "/admin/menu" },
  { icon: Image, label: "Gallery", href: "/admin/gallery" },
  { icon: MapPin, label: "Location", href: "/admin/location" },
  { icon: Star, label: "Reviews", href: "/admin/reviews" },
  { icon: Search, label: "SEO", href: "/admin/seo" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <h1 className="font-condensed text-2xl text-white tracking-wider">HANSUM</h1>
        <p className="text-white/30 text-[10px] font-sans tracking-widest uppercase mt-0.5">Content Studio</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium transition-all duration-150 ${
                active
                  ? "bg-orange-500 text-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </a>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans font-medium text-white/30 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-[#111111] border-r border-white/5 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 bg-[#111111] border-r border-white/5 flex flex-col z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-[#111111] border-b border-white/5 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-white/50 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-condensed text-xl text-white tracking-wider">HANSUM</span>
        </header>

        <div className="bg-blue-500/10 border-b border-blue-500/20 px-6 py-2 flex items-center gap-2">
          <span className="text-blue-400 text-xs">⏱</span>
          <p className="text-blue-400 text-xs font-sans">Changes may take up to 30 seconds to appear on the live site.</p>
        </div>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
