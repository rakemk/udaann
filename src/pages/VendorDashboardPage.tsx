import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  ArrowUpRight,
  ShoppingBag,
  Bell,
  ChevronRight,
  Star,
  Zap,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Earnings", value: "₹45,230", icon: DollarSign, trend: "+12.5%", color: "text-green-600", bg: "bg-green-100" },
  { label: "Active Bookings", value: "24", icon: Calendar, trend: "+3", color: "text-blue-600", bg: "bg-blue-100" },
  { label: "New Leads", value: "156", icon: Users, trend: "+18%", color: "text-orange-600", bg: "bg-orange-100" },
  { label: "Completion Rate", value: "98%", icon: TrendingUp, trend: "+2%", color: "text-purple-600", bg: "bg-purple-100" },
];

export function VendorDashboardPage() {
  const { user } = useAuth();
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mocking recent bookings for dashboard
        const data = await blink.db.bookings.list({ limit: 5, orderBy: { createdAt: 'desc' } });
        setRecentBookings(data as any[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.displayName || "Partner"}. Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl h-11 gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
          <Button className="rounded-xl h-11 gap-2 primary-gradient border-none">
            <ShoppingBag className="h-4 w-4" />
            Add New Service
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-2xl border shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <span className={cn("text-xs font-bold px-2 py-1 rounded-full", stat.bg, stat.color)}>
                {stat.trend}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-2xl border shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold">Recent Bookings</h2>
              <Button variant="ghost" size="sm" className="gap-1 font-bold">
                View All <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-0">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />)}
                </div>
              ) : recentBookings.length > 0 ? (
                <div className="divide-y">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {booking.userId.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold">Booking #{booking.id.substring(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="hidden md:block text-right">
                          <p className="text-sm font-bold">₹{booking.totalPrice}</p>
                          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{booking.paymentStatus}</p>
                        </div>
                        <div className={cn(
                          "px-3 py-1 rounded-full text-xs font-bold uppercase",
                          booking.status === 'confirmed' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        )}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center text-muted-foreground">
                  <Calendar className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>No bookings received yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Growth & Tips */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-elegant relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-primary/20 rounded-full -translate-y-16 translate-x-16 blur-3xl" />
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" /> Growth Tips
            </h3>
            <p className="text-sm text-slate-400 mb-6">Boost your local presence and earn more.</p>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
                <p className="text-xs leading-relaxed">Respond to reviews within 24 hours to improve your <span className="text-primary font-bold">Trust Score</span>.</p>
              </div>
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                </div>
                <p className="text-xs leading-relaxed">Upload <span className="text-secondary font-bold">GST/Business IDs</span> to get the Verified Badge and see 40% more bookings.</p>
              </div>
            </div>
            
            <Button className="w-full mt-8 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-bold">
              Explore Tools <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="bg-card rounded-2xl p-6 border shadow-sm">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-xs font-bold">
                <Users className="h-5 w-5" />
                Customers
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-xs font-bold">
                <Star className="h-5 w-5" />
                Reviews
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-xs font-bold">
                <Calendar className="h-5 w-5" />
                Calendar
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 rounded-xl text-xs font-bold">
                <TrendingUp className="h-5 w-5" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
