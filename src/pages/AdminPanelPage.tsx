import { useState, useEffect } from "react";
import { 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  XCircle,
  FileText,
  Search,
  Eye,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";
import { toast } from "sonner";
import { motion } from "framer-motion";

const verificationRequests = [
  {
    id: "vr1",
    businessName: "Elite Cricket Academy",
    ownerName: "Vikram Singh",
    documents: ["Aadhar Card", "Business License"],
    status: "pending",
    date: "2 hours ago"
  },
  {
    id: "vr2",
    businessName: "City Movers & Packers",
    ownerName: "Sanjay Gupta",
    documents: ["GST Registration"],
    status: "pending",
    date: "5 hours ago"
  }
];

export function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<'verifications' | 'users' | 'disputes'>('verifications');

  const handleVerify = (id: string, approve: boolean) => {
    toast.success(approve ? "Vendor verified successfully!" : "Verification rejected.");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Control Center</h1>
          <p className="text-muted-foreground">Manage verifications, users, and platform safety.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl">
          <Button 
            variant={activeTab === 'verifications' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('verifications')}
            className="rounded-lg px-6 h-10"
          >
            Verifications
          </Button>
          <Button 
            variant={activeTab === 'users' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('users')}
            className="rounded-lg px-6 h-10"
          >
            Users
          </Button>
          <Button 
            variant={activeTab === 'disputes' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('disputes')}
            className="rounded-lg px-6 h-10"
          >
            Disputes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats Column */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Platform Health</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Vendors</span>
                <span className="font-black text-secondary">1,240</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Verified %</span>
                <span className="font-black text-primary">82%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Requests</span>
                <span className="font-black text-orange-500">14</span>
              </div>
            </div>
          </div>
          
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10">
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Security Alert
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              3 accounts flagged for unusual review activity. Automated trust score adjustment in progress.
            </p>
            <Button variant="link" className="p-0 h-auto text-xs font-bold text-primary mt-4">View Flagged Accounts</Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-bold flex items-center gap-2">
                {activeTab === 'verifications' ? <ShieldCheck className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5" />}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search requests..." 
                  className="h-10 w-64 bg-background border rounded-xl pl-10 pr-4 text-sm focus:outline-none"
                />
              </div>
            </div>
            
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b bg-slate-50/30 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <th className="px-6 py-4">Request / Entity</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {verificationRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold">{req.businessName}</p>
                          <p className="text-xs text-muted-foreground">by {req.ownerName}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {req.documents.map(doc => (
                            <span key={doc} className="bg-muted px-2 py-0.5 rounded text-[10px] font-medium">{doc}</span>
                          ))}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{req.date}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase bg-yellow-100 text-yellow-700">
                          <AlertCircle className="h-3 w-3" /> {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-secondary/10 hover:text-secondary">
                            <CheckCircle2 className="h-4 w-4" onClick={() => handleVerify(req.id, true)} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive">
                            <XCircle className="h-4 w-4" onClick={() => handleVerify(req.id, false)} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {verificationRequests.length === 0 && (
                <div className="p-20 text-center text-muted-foreground">
                  No pending requests found.
                </div>
              )}
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
