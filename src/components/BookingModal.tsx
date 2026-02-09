import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BookingModal({ service, onClose }: any) {
  const [mode, setMode] = useState<'instant'|'schedule'>('instant');
  const [datetime, setDatetime] = useState('');
  const [emergency, setEmergency] = useState(false);

  if (!service) return null;

  const handleConfirm = () => {
    // Stub: In real app call booking API
    alert(`Booked ${service.title} (${mode}) ${emergency ? '[EMERGENCY]' : ''} ${datetime ? 'at ' + datetime : ''}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-background rounded-2xl w-full max-w-2xl p-6">
        <div className="flex items-start gap-4">
          <h3 className="text-xl font-bold">Book: {service.title}</h3>
          <div className="ml-auto text-sm text-muted-foreground">{service.vendorName}</div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Pricing</div>
            <div className="font-bold">Fixed: ₹{service.fixedPrice}</div>
            <div className="text-sm text-muted-foreground">Hourly: ₹{service.hourlyPrice}/hr</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Mode</div>
            <div className="flex gap-2 mt-2">
              <Button variant={mode==='instant' ? 'default' : 'outline'} size="sm" onClick={() => setMode('instant')}>Instant</Button>
              <Button variant={mode==='schedule' ? 'default' : 'outline'} size="sm" onClick={() => setMode('schedule')}>Schedule</Button>
            </div>
            {mode === 'schedule' && (
              <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} className="mt-2 w-full rounded-lg border px-3 py-2" />
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input id="em" type="checkbox" checked={emergency} onChange={() => setEmergency(!emergency)} />
          <label htmlFor="em" className="text-sm">Emergency service (priority, additional charges may apply)</label>
        </div>

        <div className="mt-6 flex items-center gap-2">
          <Button onClick={handleConfirm}>Confirm Booking</Button>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
