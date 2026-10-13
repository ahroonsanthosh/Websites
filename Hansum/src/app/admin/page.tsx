import { getMenuContent, getGalleryContent, getSettingsContent } from "@/lib/content";
import { UtensilsCrossed, Image, Clock, ExternalLink } from "lucide-react";

export default async function AdminDashboard() {
  const [menu, gallery, settings] = await Promise.all([
    getMenuContent(),
    getGalleryContent(),
    getSettingsContent(),
  ]);

  const stats = [
    { label: "Menu Items", value: menu.items.length, icon: UtensilsCrossed, href: "/admin/menu" },
    { label: "Gallery Images", value: gallery.images.length, icon: Image, href: "/admin/gallery" },
    {
      label: "Opening Hours",
      value: "12–8pm",
      icon: Clock,
      href: "/admin/location",
    },
  ];

  const quickLinks = [
    { label: "Edit Hero", href: "/admin/hero" },
    { label: "Manage Menu", href: "/admin/menu" },
    { label: "Upload Images", href: "/admin/gallery" },
    { label: "Update Hours", href: "/admin/location" },
    { label: "Manage Reviews", href: "/admin/reviews" },
    { label: "SEO Settings", href: "/admin/seo" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold mb-1">Welcome back 👋</h1>
        <p className="text-white/30 text-sm">Manage your Hansum Rotisserie content below.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="bg-[#141414] border border-white/5 rounded-2xl p-5 hover:border-orange-500/20 transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-orange-500" />
              <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-white/40 transition-colors" />
            </div>
            <div className="text-white text-2xl font-semibold mb-1">{stat.value}</div>
            <div className="text-white/30 text-xs">{stat.label}</div>
          </a>
        ))}
      </div>

      {/* Announcement banner status */}
      {settings.announcement_active && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 text-xs font-medium uppercase tracking-widest">Live Banner</span>
          </div>
          <p className="text-white/60 text-sm">{settings.announcement_banner}</p>
        </div>
      )}

      {/* Quick links */}
      <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
        <h2 className="text-white font-semibold text-sm mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 text-white/60 hover:text-white text-sm font-sans transition-all duration-150 text-center"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* View site link */}
      <div className="mt-6 text-center">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-white/20 hover:text-orange-400 text-sm font-sans transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View live website
        </a>
      </div>
    </div>
  );
}
