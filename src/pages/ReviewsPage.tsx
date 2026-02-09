import { useState, useEffect } from "react";
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  ShieldCheck,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";

const reviews = [
  {
    id: "r1",
    userName: "Amit Kumar",
    vendorName: "Rajesh Home Services",
    rating: 5,
    comment: "Excellent work! Rajesh fixed the pipe leakage in less than an hour. Very professional and polite.",
    date: "2 days ago",
    verified: true,
    likes: 12
  },
  {
    id: "r2",
    userName: "Sneha Patel",
    vendorName: "Local Express Transport",
    rating: 4,
    comment: "The delivery was a bit late but the items were safe. The driver was helpful with the heavy boxes.",
    date: "1 week ago",
    verified: true,
    likes: 5
  },
  {
    id: "r3",
    userName: "Vikram Singh",
    vendorName: "Elite Cricket Coaching",
    rating: 5,
    comment: "Best academy in the area. Coach Vikram is very patient with kids. Highly recommended!",
    date: "3 weeks ago",
    verified: false,
    likes: 8
  }
];

export function ReviewsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Reviews</h1>
          <p className="text-muted-foreground">See what others are saying about local vendors and service providers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 font-bold">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="rounded-xl h-10 gap-2 font-bold">
            <ArrowUpDown className="h-4 w-4" /> Sort
          </Button>
        </div>
      </div>

      {/* Trust Score Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-elegant relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full w-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-10" />
          <div className="text-center md:text-left space-y-2 relative z-10">
            <h2 className="text-xl font-bold">Platform Trust Score</h2>
            <p className="text-slate-400 text-sm max-w-xs">Our trust score is calculated based on verified document status, service completion rate, and user feedback.</p>
            <div className="pt-4 flex items-center justify-center md:justify-start gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">UDAANN VERIFIED</p>
                <p className="text-sm font-bold">Safe Local Commerce</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center relative z-10">
            <div className="relative h-32 w-32 flex items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform">
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={36} className="text-primary" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black">9.2</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Excellent</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-3xl p-8 border shadow-sm flex flex-col justify-center space-y-4">
          <h3 className="font-bold text-center">Your Contribution</h3>
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Star className="h-8 w-8 fill-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black">12</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Reviews Written</p>
          </div>
          <Button variant="secondary" className="w-full rounded-xl font-bold h-11">Write a Review</Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, i) => (
          <motion.div 
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card rounded-2xl border p-6 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted border flex items-center justify-center font-bold text-lg">
                  {review.userName.substring(0, 1)}
                </div>
                <div>
                  <div className="font-bold flex items-center gap-2">
                    {review.userName}
                    {review.verified && (
                      <div className="bg-secondary/10 text-secondary p-0.5 rounded-full" title="Verified Customer">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">reviewed <span className="font-bold text-primary">{review.vendorName}</span></div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-4 w-4", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted")} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{review.date}</span>
              </div>
            </div>
            
            <p className="text-sm leading-relaxed">{review.comment}</p>
            
            <div className="flex items-center gap-6 pt-4 border-t">
              <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                <ThumbsUp className="h-4 w-4" /> Helpful ({review.likes})
              </button>
              <button className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" /> Reply
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
