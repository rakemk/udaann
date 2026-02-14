import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  Calendar, 
  ShoppingBag, 
  MessageSquare, 
  User, 
  LayoutDashboard,
  Star,
  Settings,
  HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Calendar, label: "Bookings", href: "/profile" }, // Linking to profile for now as placeholder for history
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Star, label: "Reviews", href: "/reviews" },
];

const vendorItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/vendor/dashboard" },
];

const adminItem = { icon: ShoppingBag, label: "Admin Panel", href: "/admin" };

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const location = useLocation();
  const { user } = useAuth();

  const isVendor = Boolean(
    user && (
      // common possible shapes for role flags
      (user as any).roles?.includes?.("vendor") ||
      (user as any).role === "vendor" ||
      (user as any).isVendor ||
      (user as any).customClaims?.role === "vendor"
    )
  );

  const isAdmin = Boolean(
    user && (
      (user as any).roles?.includes?.("admin") ||
      (user as any).role === "admin" ||
      (user as any).isAdmin ||
      (user as any).customClaims?.role === "admin"
    )
  );

  return (
    <aside className={cn(
      "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform md:translate-x-0",
      !isOpen && "-translate-x-full"
    )}>
      <div className="flex h-full flex-col p-4">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 rounded-lg px-3 h-11",
                  location.pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Vendor Portal
          </h3>
          <div className="space-y-1">
            {isVendor && vendorItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 rounded-lg px-3 h-11",
                    location.pathname === item.href && "bg-secondary/10 text-secondary hover:bg-secondary/20"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}

            {isAdmin && (
              <Link key={adminItem.href} to={adminItem.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 rounded-lg px-3 h-11",
                    location.pathname === adminItem.href && "bg-secondary/10 text-secondary hover:bg-secondary/20"
                  )}
                >
                  <adminItem.icon className="h-5 w-5" />
                  <span>{adminItem.label}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg px-3 h-11">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-lg px-3 h-11">
            <HelpCircle className="h-5 w-5" />
            <span>Help Center</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
