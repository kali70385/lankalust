import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, Heart, BookOpen, LogOut, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { to: "/ads", label: "Adult Ads" },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/dating", label: "Dating", icon: Heart },
  { to: "/stories", label: "WalKatha", icon: BookOpen },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout, setShowAuthModal } = useAuth();

  const handlePostAdClick = () => {
    if (isLoggedIn) {
      navigate("/post-ad");
    } else {
      setShowAuthModal(true);
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-glass">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-display font-bold text-gradient">LankaLust</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant={location.pathname.startsWith(link.to) ? "default" : "ghost"}
                size="sm"
                className="gap-1.5"
              >
                {link.icon && <link.icon className="w-4 h-4" />}
                {link.label}
              </Button>
            </Link>
          ))}
          <Button variant="hero" size="sm" onClick={handlePostAdClick}>Post Ad</Button>

          {isLoggedIn ? (
            <div className="flex items-center gap-1 ml-1">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <UserCircle className="w-4 h-4" /> My Profile
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)} className="gap-1.5">
              <UserCircle className="w-4 h-4" /> Login / Register
            </Button>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                  <Button
                    variant={location.pathname.startsWith(link.to) ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </Button>
                </Link>
              ))}
              <Button variant="hero" className="w-full" onClick={handlePostAdClick}>Post Ad</Button>

              {isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <UserCircle className="w-4 h-4" /> My Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive" onClick={() => { logout(); setMobileOpen(false); }}>
                    <LogOut className="w-4 h-4" /> Logout
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}>
                  <UserCircle className="w-4 h-4" /> Login / Register
                </Button>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
