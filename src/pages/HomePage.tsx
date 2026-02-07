import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin, Star, ShieldCheck, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";

const categories = [
  { name: "Home Services", icon: "🏠", color: "bg-orange-100" },
  { name: "Transport", icon: "🚚", color: "bg-blue-100" },
  { name: "Event Planning", icon: "🎉", color: "bg-pink-100" },
  { name: "Cricket Academy", icon: "🏏", color: "bg-green-100" },
  { name: "Maid / Bai", icon: "🧹", color: "bg-yellow-100" },
  { name: "Local Drivers", icon: "🚗", color: "bg-indigo-100" },
];

export function HomePage() {
  const navigate = useNavigate();
  const [featuredVendors, setFeaturedVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await blink.db.vendors.list({ limit: 6 });
        setFeaturedVendors(data as any[]);
      } catch (err) {
        console.error("Failed to fetch vendors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-white md:px-12 md:py-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight md:text-6xl mb-6"
          >
            Empowering Local Commerce with <span className="text-primary">UDAAN</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-300 mb-8 md:text-xl"
          >
            The Operating System for local service providers, event organizers, and vendors. India-first, trust-first.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Your location (e.g. Mumbai, Borivali)" 
                className="w-full h-12 bg-white/10 backdrop-blur-md rounded-xl pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <Button size="lg" className="rounded-xl h-12 px-8 font-semibold">
              Get Started
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Browse Categories</h2>
          <Button variant="link" className="text-primary font-semibold">View All</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer"
            >
              <div className={cn(
                "h-24 rounded-2xl flex flex-col items-center justify-center gap-2 mb-2 transition-all group-hover:shadow-md",
                cat.color
              )}>
                <span className="text-3xl">{cat.icon}</span>
              </div>
              <span className="text-sm font-semibold text-center block">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y">
        <div className="flex items-start gap-4 p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Verified Vendors</h3>
            <p className="text-sm text-muted-foreground">Every provider undergoes strict document verification.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4">
          <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Real-time Booking</h3>
            <p className="text-sm text-muted-foreground">Live availability slots for instant confirmation.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <Zap className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold mb-1">Escrow Payments</h3>
            <p className="text-sm text-muted-foreground">Payments are only released after service completion.</p>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Featured Service Providers</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">Top Rated</Button>
            <Button variant="outline" size="sm" className="rounded-full">Nearby</Button>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVendors.map((vendor) => (
              <motion.div 
                key={vendor.id}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/vendor/${vendor.id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-elegant"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={vendor.logoUrl} alt={vendor.businessName} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                  {vendor.verificationStatus === 'verified' && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-secondary shadow-sm">
                      <ShieldCheck className="h-3 w-3" />
                      VERIFIED
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                    Starts ₹499
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{vendor.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{vendor.rating}</span>
                      <span className="text-xs text-muted-foreground">({vendor.totalReviews})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{vendor.businessName}</h3>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{vendor.description}</p>
                  <Button className="w-full mt-4 rounded-xl group-hover:primary-gradient transition-all border-none">
                    View Profile & Book
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
