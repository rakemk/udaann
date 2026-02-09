import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, MapPin, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get("category") || "All";

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const filters = category && category !== "All" ? { category } : {};
        const data = await (blink.db as any).vendors.list({ limit: 12, ...filters });
        setVendors(data as any[]);
      } catch (err) {
        console.error("Failed to fetch vendors", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [category]);

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold mb-4">
          {category && category !== "All" ? `${category} Services` : "Search Services"}
        </h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by location, skill, or vendor name..."
              className="w-full h-11 bg-background rounded-xl pl-10 pr-4 text-sm border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button size="sm" className="rounded-lg gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </motion.div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {loading ? "Loading..." : `${vendors.length} Results`}
          </h2>
          <select className="px-4 py-2 rounded-lg border bg-background text-sm">
            <option>Most Relevant</option>
            <option>Top Rated</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(`/vendor/${vendor.id}`)}
                className="group cursor-pointer overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-elegant"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={vendor.logoUrl || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"}
                    alt={vendor.businessName}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  {vendor.verificationStatus === "verified" && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-secondary shadow-sm">
                      <ShieldCheck className="h-3 w-3" />
                      VERIFIED
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                    Starts ₹{vendor.startingPrice || 499}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {vendor.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold">{vendor.rating || 4.8}</span>
                      <span className="text-xs text-muted-foreground">({vendor.totalReviews || 24})</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors mb-1">
                    {vendor.businessName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {vendor.description || "Professional service provider"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <MapPin className="h-3 w-3" />
                    {vendor.location || "Mumbai"}
                  </div>
                  <Button className="w-full rounded-xl border-none">
                    View Profile & Book
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No vendors found in this category.</p>
            <Button onClick={() => navigate("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
