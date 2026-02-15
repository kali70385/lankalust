import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdSpace } from "@/components/AdSpace";
import SlidingAdSpace from "@/components/SlidingAdSpace";
import BottomMobileAd from "@/components/BottomMobileAd";

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    {/* Top leaderboard – below header */}
    <AdSpace slotKey="top-leaderboard" className="w-full flex justify-center py-1" />
    <main className="flex-1">
      <Outlet />
    </main>
    {/* Mobile-only ad – fixed just above footer, not closeable */}
    <BottomMobileAd />
    <Footer />
    {/* Global sliding bottom strip */}
    <SlidingAdSpace />
  </div>
);

export default Layout;
