import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toaster } from "sonner";

export function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} />
      <main className="md:pl-64 pt-16 min-h-[calc(100vh-4rem)]">
        <div className="container py-6 md:py-10 max-w-7xl mx-auto px-4 md:px-8">
          <Outlet />
        </div>
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}
