import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  CreditCard, 
  ShieldCheck,
  Zap,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
}

export function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, signInWithGoogle } = useAuth();
  
  const [service, setService] = useState<Service | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState<'selection' | 'payment' | 'success'>('selection');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await blink.db.services.get(serviceId as string);
        const sl = await blink.db.slots.list({ where: { serviceId } });
        setService(s as any);
        setSlots(sl as any);
      } catch (err) {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceId]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.info("Please login to continue booking");
      signInWithGoogle();
      return;
    }
    if (!selectedSlot) return;
    setBookingStep('payment');
  };

  const processPayment = async () => {
    try {
      setLoading(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const booking = await blink.db.bookings.create({
        userId: user!.id,
        slotId: selectedSlot!.id,
        status: 'confirmed',
        paymentStatus: 'paid',
        totalPrice: service!.price
      });

      await blink.db.slots.update(selectedSlot!.id, { status: 'booked' });
      
      setBookingStep('success');
      toast.success("Booking confirmed successfully!");
    } catch (err) {
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && bookingStep === 'selection') return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );

  if (bookingStep === 'success') return (
    <div className="max-w-md mx-auto py-20 text-center space-y-6">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="h-20 w-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle2 className="h-10 w-10 text-secondary" />
      </motion.div>
      <h1 className="text-3xl font-bold">Booking Confirmed!</h1>
      <p className="text-muted-foreground">Your booking for <strong>{service?.name}</strong> has been secured. You can now chat with the vendor.</p>
      <div className="bg-muted p-4 rounded-xl text-left space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Booking ID</span>
          <span className="font-mono font-bold uppercase">#UD-BOOK-772</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date & Time</span>
          <span className="font-bold">{new Date(selectedSlot!.startTime).toLocaleString()}</span>
        </div>
      </div>
      <div className="flex gap-4">
        <Button className="flex-1 rounded-xl h-12" onClick={() => navigate('/bookings')}>View My Bookings</Button>
        <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => navigate('/')}>Home</Button>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-4 w-4" /> Back to vendor
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {bookingStep === 'selection' ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">Select a Time Slot</h1>
                  <p className="text-muted-foreground">Choose a convenient time for your service with {service?.name}.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={slot.status === 'booked'}
                      onClick={() => setSelectedSlot(slot)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all relative overflow-hidden",
                        selectedSlot?.id === slot.id 
                          ? "border-primary bg-primary/5 ring-1 ring-primary shadow-elegant" 
                          : "hover:border-primary/40",
                        slot.status === 'booked' && "opacity-50 cursor-not-allowed bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center",
                          selectedSlot?.id === slot.id ? "bg-primary text-white" : "bg-muted"
                        )}>
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-bold">{new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-xs text-muted-foreground">{new Date(slot.startTime).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {slot.status === 'booked' && (
                        <span className="absolute top-2 right-2 bg-muted-foreground/20 px-2 py-0.5 rounded text-[10px] font-bold">BOOKED</span>
                      )}
                    </button>
                  ))}
                  {slots.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl">
                      <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No available slots found for this service.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">Secure Payment</h1>
                  <p className="text-muted-foreground">Your payment will be held in escrow until the service is completed.</p>
                </div>

                <div className="bg-card rounded-2xl border p-6 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <Zap className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm font-bold">UDAANN FastPay Enabled</p>
                      <p className="text-xs text-muted-foreground">Verified secure gateway for local commerce.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 border rounded-xl bg-muted/20">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-sm font-bold">Pay via Razorpay / UPI</div>
                        <div className="text-xs text-muted-foreground">All UPI apps, Cards & Netbanking</div>
                      </div>
                      <div className="h-4 w-4 rounded-full border-4 border-primary" />
                    </div>
                  </div>

                  <Button 
                    onClick={processPayment}
                    disabled={loading}
                    className="w-full h-14 rounded-xl text-lg font-bold shadow-elegant primary-gradient border-none"
                  >
                    {loading ? "Processing Securely..." : `Pay ₹${service?.price} & Confirm`}
                  </Button>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground font-medium">
                    <ShieldCheck className="h-4 w-4" /> Secure 256-bit SSL Encrypted Payment
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl p-6 border shadow-sm sticky top-24">
            <h3 className="text-lg font-bold mb-6">Booking Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-bold text-right">{service?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time Slot</span>
                <span className="font-bold text-right">
                  {selectedSlot ? new Date(selectedSlot.startTime).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : "Not selected"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee</span>
                <span className="font-bold text-secondary">FREE</span>
              </div>
              <div className="pt-4 border-t flex justify-between items-end">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-black text-primary">₹{service?.price}</span>
              </div>
            </div>

            {bookingStep === 'selection' && (
              <Button 
                onClick={handleBooking}
                disabled={!selectedSlot}
                className="w-full mt-8 h-12 rounded-xl font-bold"
              >
                Continue to Payment
              </Button>
            )}

            <div className="mt-8 pt-6 border-t flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5 text-secondary" />
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">
                <strong>CANCEL ANYTIME</strong> before 2 hours of service. Full refund guaranteed via UDAANN escrow system.
              </p>
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
