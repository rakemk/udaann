import { useState } from "react";
import { Star, BadgeCheck, MessageSquare, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServiceCard({ service, onBook }: any) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
      <div className="p-4 flex gap-4 items-start">
        <div className="h-20 w-20 rounded-xl bg-muted overflow-hidden flex items-center justify-center">
          {service.image ? (
            <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
          ) : (
            <div className="text-3xl">🔧</div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">{service.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="font-semibold">{service.rating}</span>
                  <span className="text-muted-foreground">({service.reviews})</span>
                </div>
                {service.verified && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <BadgeCheck className="h-4 w-4" /> Verified
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="font-bold">₹{service.fixedPrice}</div>
              <div className="text-xs text-muted-foreground">+ ₹{service.hourlyPrice}/hr</div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{service.description}</p>

          <div className="mt-3 flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Hide details" : "View details"}
            </Button>
            <Button size="sm" onClick={() => onBook(service)}>Book</Button>
            <Button variant="ghost" size="sm" className="ml-auto" onClick={() => alert('Open chat (stub)')}>
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => alert('Call vendor (stub)')}>
              <Phone className="h-4 w-4" />
            </Button>
          </div>

          {expanded && (
            <div className="mt-3 text-sm text-muted-foreground">
              <ul className="list-disc pl-5">
                {service.features.map((f: string, i: number) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
