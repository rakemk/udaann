import { Link } from "react-router-dom";
import { Search, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { isAuthenticated, signInWithGoogle, user } = useAuth();

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        
        <Link to="/" className="flex items-center gap-2 mr-6">
          <div className="h-8 w-8 rounded-lg primary-gradient flex items-center justify-center text-white font-bold text-xl shadow-elegant">
            U
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:inline-block">UDAAN</span>
        </Link>

        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search services, vendors, events..."
              className="w-full h-10 bg-muted rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
              </Button>
              <Link to="/profile">
                <div className="h-9 w-9 rounded-full bg-muted border overflow-hidden flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.displayName} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </Link>
            </>
          ) : (
            <Button onClick={signInWithGoogle} className="rounded-full px-6">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
