import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MessageSquare, 
  Share2, 
  ChevronRight,
  Info,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";
import { toast } from "sonner";

interface Vendor {
  id: string;
  businessName: string;
  category: string;
  description: string;
  verificationStatus: string;
  logoUrl: string;
  rating: number;
  totalReviews: number;
  location: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export function VendorDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const v = await blink.db.vendors.get(id as string);
        const s = await blink.db.services.list({ where: { vendorId: id } });
        setVendor(v as any);
        setServices(s as any);
      } catch (err) {
        toast.error("Failed to load vendor details");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  if (!vendor) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold">Vendor not found</h2>
      <Button variant="link" onClick={() => navigate("/")}>Go back home</Button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-elegant">
        <img src={vendor.logoUrl} alt={vendor.businessName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 right-8 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{vendor.category}</span>
            {vendor.verificationStatus === 'verified' && (
              <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> VERIFIED
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{vendor.businessName}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{vendor.rating} ({vendor.totalReviews} reviews)</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <MapPin className="h-4 w-4" />
              <span>{vendor.location}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-8 right-8 flex gap-2">
          <Button variant="secondary" size="icon" className="rounded-full backdrop-blur">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Services */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card rounded-2xl p-6 border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" /> About this Business
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {vendor.description || "No description provided."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Verified Identity Documents
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Background Checked
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                India-first Support
              </div>
              <div className="flex items-center gap-3 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                Escrow Protected Payments
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight">Available Services</h2>
            <div className="grid grid-cols-1 gap-4">
              {services.map((service) => (
                <motion.div 
                  key={service.id}
                  whileHover={{ x: 5 }}
                  className="bg-card p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-primary/50"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">{service.name}</h3>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {service.duration} mins
                      </div>
                      <div className="text-lg font-bold text-primary">₹{service.price}</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/book/${service.id}`)}
                    className="rounded-xl px-8 h-12 font-bold"
                  >
                    Select & Book <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
              {services.length === 0 && (
                <div className="bg-muted/30 rounded-2xl p-10 text-center border-2 border-dashed">
                  <p className="text-muted-foreground font-medium">No services listed yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Quick Contact & Trust */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-6">Connect with Vendor</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start h-12 gap-3 rounded-xl">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span>Chat with Rajesh</span>
              </Button>
              <Button variant="outline" className="w-full justify-start h-12 gap-3 rounded-xl">
                <Phone className="h-5 w-5 text-secondary" />
                <span>Request a Call</span>
              </Button>
            </div>
            
            <div className="mt-8 pt-6 border-t space-y-4">
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">UDAANN TRUST GUARANTEE</p>
                <p className="text-sm text-muted-foreground">Payments are held in escrow and released only after you confirm service completion.</p>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span>LICENSED BUSINESS</span>
                <span className="text-secondary">#UD-99212</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
