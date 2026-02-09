import { useState } from "react";
import ServiceCard from "@/components/ServiceCard";
import BookingModal from "@/components/BookingModal";
import { UdaanLogo } from "@/components/UdaanLogo";
import { Button } from "@/components/ui/button";

const SUBCATEGORIES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'AC Repair & Installation',
  'RO / Water Purifier Service',
  'Refrigerator / Washing Machine Repair',
  'Painter',
  'Pest Control',
  'Home Cleaning'
];

const MOCK_SERVICES = [
  {
    id: 's1',
    title: 'Experienced Electrician - Fix & Install',
    description: 'Wiring, switches, short-circuit repair, new fittings & fixtures',
    fixedPrice: 299,
    hourlyPrice: 400,
    rating: 4.8,
    reviews: 124,
    verified: true,
    features: ['Certified professional', '1 year warranty on work', 'GST invoice'],
    vendorName: 'Sharma Electricals',
    serviceType: 'Electrician'
  },
  {
    id: 's2',
    title: 'Home Plumber - Leak & Drain',
    description: 'Leak detection, pipe replacement, drain cleaning',
    fixedPrice: 249,
    hourlyPrice: 350,
    rating: 4.6,
    reviews: 90,
    verified: true,
    features: ['Licensed plumber', 'Same-day service', 'Transparent billing'],
    vendorName: 'QuickFix Plumbing',
    serviceType: 'Plumber'
  }
];

export function HomeServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>('Electrician');
  const [bookingService, setBookingService] = useState<any | null>(null);

  const services = MOCK_SERVICES.filter(s => !selectedCategory || s.serviceType === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12"><UdaanLogo size="md" variant="icon" /></div>
        <div>
          <h1 className="text-2xl font-bold">Home Services</h1>
          <p className="text-sm text-muted-foreground">Book trusted, verified professionals for household needs.</p>
        </div>
      </div>

      <div className="overflow-x-auto py-2">
        <div className="inline-flex gap-3">
          {SUBCATEGORIES.map((c) => (
            <Button key={c} variant={selectedCategory===c? 'default' : 'ghost'} onClick={() => setSelectedCategory(c)} className="whitespace-nowrap">{c}</Button>
          ))}
        </div>
      </div>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(s => (
            <ServiceCard key={s.id} service={s} onBook={(svc:any)=>setBookingService(svc)} />
          ))}
        </div>
      </section>

      {bookingService && (
        <BookingModal service={bookingService} onClose={() => setBookingService(null)} />
      )}
    </div>
  );
}

export default HomeServicesPage;
