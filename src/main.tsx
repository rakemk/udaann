import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { VendorDetailsPage } from './pages/VendorDetailsPage';
import { BookingPage } from './pages/BookingPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { ChatPage } from './pages/ChatPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { AdminPanelPage } from './pages/AdminPanelPage';
import { ProfilePage } from './pages/ProfilePage';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/vendor/:id" element={<VendorDetailsPage />} />
          <Route path="/book/:serviceId" element={<BookingPage />} />
          <Route path="/vendor/dashboard" element={<VendorDashboardPage />} />
          <Route path="/messages" element={<ChatPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* More routes will be added here */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
