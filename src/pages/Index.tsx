import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import AdSearchFilter from "@/components/AdSearchFilter";
import AdListItem from "@/components/AdListItem";
import { getAllAds } from "@/data/unifiedAds";
import { useAuth } from "@/contexts/AuthContext";
import {
  User, Users, Sparkles, Camera, ShoppingBag, Briefcase, Building, MoreHorizontal,
  MessageCircle, Heart, BookOpen, ArrowRight, ChevronLeft, ChevronRight,
} from "lucide-react";

const ADS_PER_PAGE = 16;

const categories = [
  { to: "/ads?cat=male", icon: User, label: "Male Personals", count: 342 },
  { to: "/ads?cat=female", icon: Users, label: "Female Personals", count: 518 },
  { to: "/ads?cat=massage", icon: Sparkles, label: "Massage", count: 276 },
  { to: "/ads?cat=livecam", icon: Camera, label: "Live Cam", count: 189 },
  { to: "/ads?cat=toys", icon: ShoppingBag, label: "Toys", count: 95 },
  { to: "/ads?cat=jobs", icon: Briefcase, label: "Jobs", count: 64 },
  { to: "/ads?cat=hotels", icon: Building, label: "Hotel/Rooms", count: 147 },
  { to: "/ads?cat=other", icon: MoreHorizontal, label: "Other", count: 83 },
];

const heroFeatures = [
  { icon: MessageCircle, label: "Free Adult Chat Rooms", to: "/chat" },
  { icon: Heart, label: "Adult Dating", to: "/dating" },
  { icon: BookOpen, label: "WalKatha Stories", to: "/stories" },
  { icon: Sparkles, label: "Adult Ads", to: "/ads" },
];

const Index = () => {
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("all");
  const [city, setCity] = useState("all");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { isLoggedIn, setShowAuthModal } = useAuth();

  const handlePostAdClick = () => {
    if (isLoggedIn) {
      navigate("/post-ad");
    } else {
      setShowAuthModal(true);
    }
  };

  // Applied filters — only updated when Search is clicked
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedDistrict, setAppliedDistrict] = useState("all");
  const [appliedCity, setAppliedCity] = useState("all");

  const handleSearch = () => {
    setAppliedSearch(search);
    setAppliedDistrict(district);
    setAppliedCity(city);
    setPage(1);
  };

  const allAds = getAllAds();

  const filtered = allAds.filter((ad) => {
    if (appliedSearch && !ad.title.toLowerCase().includes(appliedSearch.toLowerCase()) && !ad.description.toLowerCase().includes(appliedSearch.toLowerCase())) return false;
    if (appliedDistrict !== "all" && ad.district !== appliedDistrict) return false;
    if (appliedCity !== "all" && ad.city !== appliedCity) return false;
    return true;
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/6 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent/4 blur-[100px] pointer-events-none" />
        <div className="container relative text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-4">
              Welcome to <span className="text-gradient">LankaLust</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-3">
              Sri Lanka's hottest adult playground 🔥
            </p>
            <p className="text-sm md:text-base text-muted-foreground/80 max-w-2xl mx-auto mb-8">
              <span className="text-primary font-medium">Free chat rooms</span> · <span className="text-primary font-medium">Adult dating</span> · <span className="text-primary font-medium">Steamy WalKatha</span> · <span className="text-primary font-medium">Adult classifieds</span> — all in one place.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {heroFeatures.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
              >
                <Link to={f.to}>
                  <div className="flex items-center gap-2 bg-card/70 backdrop-blur-md border border-border/60 rounded-full px-4 py-2.5 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300 group cursor-pointer">
                    <f.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-foreground/90 group-hover:text-primary transition-colors">{f.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button variant="hero" size="lg" className="gap-2 text-base" onClick={handlePostAdClick}>
              Post Your Ad — It's Free
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-4 -mt-8 relative z-10">
        <div className="container">
          <div className="bg-card/80 backdrop-blur-lg border border-border rounded-xl p-4 md:p-6 glow-primary-sm">
            <AdSearchFilter
              search={search} onSearchChange={setSearch}
              district={district} onDistrictChange={setDistrict}
              city={city} onCityChange={setCity}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6">
        <div className="container">
          <h2 className="text-xl md:text-2xl font-display font-bold text-center mb-4">
            Browse <span className="text-gradient">Categories</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.label} {...cat} delay={i * 0.05} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Ads */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold">
              Latest <span className="text-gradient">Ads</span>
            </h2>
            <Link to="/ads">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {filtered.length > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              Showing {(page - 1) * ADS_PER_PAGE + 1}–{Math.min(page * ADS_PER_PAGE, filtered.length)} of {filtered.length} ads
            </p>
          )}

          <div className="flex flex-col gap-3">
            {filtered.slice((page - 1) * ADS_PER_PAGE, page * ADS_PER_PAGE).map((ad, i) => (
              <AdListItem key={ad.id} ad={ad} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No ads found matching your criteria.</p>
          )}

          {/* Pagination */}
          {(() => {
            const totalPages = Math.max(1, Math.ceil(filtered.length / ADS_PER_PAGE));
            if (totalPages <= 1) return null;

            const pageNumbers: (number | "...")[] = [];
            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
            } else {
              pageNumbers.push(1);
              if (page > 3) pageNumbers.push("...");
              for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pageNumbers.push(i);
              }
              if (page < totalPages - 2) pageNumbers.push("...");
              pageNumbers.push(totalPages);
            }

            return (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="gap-1">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </Button>
                {pageNumbers.map((p, i) =>
                  p === "..." ? (
                    <span key={`dots-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
                  ) : (
                    <Button key={p} variant={page === p ? "default" : "secondary"} size="sm" onClick={() => setPage(p as number)} className="min-w-[36px]">
                      {p}
                    </Button>
                  )
                )}
                <Button variant="secondary" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            );
          })()}
        </div>
      </section>

    </div>
  );
};

export default Index;
