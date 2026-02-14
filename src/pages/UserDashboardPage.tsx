import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Heart, User, Clock } from "lucide-react";

export function UserDashboardPage() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<any[]>([]);

  useEffect(() => {
    // Minimal placeholder: real data should come from blink.db.bookings for the user
    setUpcoming([
      { id: 'b1', title: 'AC Repair', date: '2026-02-14', time: '10:00 AM', vendor: 'Sharma Electricals' },
    ]);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.displayName || 'User'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Booking History</Button>
          <Button>Saved Vendors</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-2">Upcoming Bookings</h3>
          {upcoming.length ? (
            upcoming.map((b) => (
              <div key={b.id} className="py-3 border-b last:border-b-0"> 
                <div className="font-semibold">{b.title}</div>
                <div className="text-xs text-muted-foreground">{b.date} • {b.time} • {b.vendor}</div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No upcoming bookings.</div>
          )}
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-2">Saved Vendors</h3>
          <div className="text-sm text-muted-foreground">You haven't saved any vendors yet.</div>
        </div>

        <div className="bg-card p-6 rounded-2xl border shadow-sm">
          <h3 className="font-bold mb-2">Quick Actions</h3>
          <div className="flex flex-col gap-2">
            <Button variant="outline">Write a Review</Button>
            <Button variant="ghost">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboardPage;
