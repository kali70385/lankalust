import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import AuthModal from "@/components/AuthModal";
import DatingAuthModal from "@/components/DatingAuthModal";
import { AuthProvider } from "@/contexts/AuthContext";
import { DatingAuthProvider } from "@/contexts/DatingAuthContext";
import Index from "./pages/Index";
import AdsPage from "./pages/AdsPage";
import ChatPage from "./pages/ChatPage";
import DatingPage from "./pages/DatingPage";
import DatingProfilePage from "./pages/DatingProfilePage";
import DatingMemberPage from "./pages/DatingMemberPage";
import DatingMailboxPage from "./pages/DatingMailboxPage";
import StoriesPage from "./pages/StoriesPage";
import PostAdPage from "./pages/PostAdPage";
import ProfilePage from "./pages/ProfilePage";
import AdDetailPage from "./pages/AdDetailPage";
import StoryDetailPage from "./pages/StoryDetailPage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import SafetyPage from "./pages/SafetyPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import AgeVerification from "@/components/AgeVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DatingAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AgeVerification />
          <AuthModal />
          <DatingAuthModal />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/ads" element={<AdsPage />} />
                <Route path="/ad/:id" element={<AdDetailPage />} />
                <Route path="/chat" element={<ChatPage />} />
                <Route path="/dating" element={<DatingPage />} />
                <Route path="/dating/profile" element={<DatingProfilePage />} />
                <Route path="/dating/member/:id" element={<DatingMemberPage />} />
                <Route path="/dating/mailbox" element={<DatingMailboxPage />} />
                <Route path="/stories" element={<StoriesPage />} />
                <Route path="/story/:id" element={<StoryDetailPage />} />
                <Route path="/post-ad" element={<PostAdPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/safety" element={<SafetyPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DatingAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
