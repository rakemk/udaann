import { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  Settings, 
  LogOut, 
  History, 
  Heart, 
  ShieldCheck,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isVendor = Boolean(
    user && (
      (user as any).roles?.includes?.("vendor") ||
      (user as any).role === "vendor" ||
      (user as any).isVendor ||
      (user as any).customClaims?.role === "vendor"
    )
  );

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card rounded-3xl border p-8 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center text-primary font-black text-3xl shadow-lg">
          {user?.displayName?.substring(0, 1) || "U"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.displayName || "Guest User"}</h1>
          <p className="text-muted-foreground">{user?.email || "Connect your account"}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-2">
            <MapPin className="h-4 w-4" /> Mumbai, MH
          </Button>
          <Button variant="outline" size="sm" className="rounded-full gap-2 text-secondary border-secondary/20 bg-secondary/5">
            <ShieldCheck className="h-4 w-4" /> Level 2 Verified
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" className="h-32 rounded-3xl flex-col gap-3 font-bold border-2 hover:border-primary/50 hover:bg-primary/5">
          <History className="h-6 w-6 text-primary" />
          Booking History
        </Button>
        <Button variant="outline" className="h-32 rounded-3xl flex-col gap-3 font-bold border-2 hover:border-secondary/50 hover:bg-secondary/5">
          <Heart className="h-6 w-6 text-secondary" />
          Saved Vendors
        </Button>
      </div>

      <div className="bg-card rounded-3xl border overflow-hidden shadow-sm">
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start h-14 gap-4 px-6 rounded-2xl">
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-semibold">Account Settings</span>
          </Button>
          {isVendor && (
            <Button 
              onClick={() => navigate('/vendor/dashboard')}
              variant="ghost" 
              className="w-full justify-start h-14 gap-4 px-6 rounded-2xl text-secondary hover:text-secondary hover:bg-secondary/5"
            >
              <Building className="h-5 w-5" />
              <span className="flex-1 text-left font-semibold">Vendor Dashboard</span>
            </Button>
          )}
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="ghost" 
            className="w-full justify-start h-14 gap-4 px-6 rounded-2xl"
          >
            <User className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-semibold">Your Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start h-14 gap-4 px-6 rounded-2xl">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <span className="flex-1 text-left font-semibold">Preferences</span>
          </Button>
          <div className="h-px bg-border my-2 mx-6" />
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            className="w-full justify-start h-14 gap-4 px-6 rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/5"
          >
            <LogOut className="h-5 w-5" />
            <span className="flex-1 text-left font-semibold">Logout</span>
          </Button>
        </div>
      </div>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">UDAANN OS v1.0.2</p>
      </div>
    </div>
  );
}
