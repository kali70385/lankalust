import React, { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, MapPin, Search, Users, LogOut, UserCircle, Clock, ChevronLeft, ChevronRight, SlidersHorizontal, X, Mail } from "lucide-react";
import { useDatingAuth } from "@/contexts/DatingAuthContext";
import { getAllPublicProfiles, formatLastActive, type DatingProfile, type Gender, type Seeking } from "@/data/datingProfiles";
import { getUnreadCount } from "@/data/datingMessages";
import { RotatingAdSpace } from "@/components/AdSpace";
import { districts } from "@/data/locations";

// ─── Constants ──────────────────────────────────────────────────────
const MEMBERS_PER_PAGE = 20;
const districtNames = Object.keys(districts);

type SortOption = "lastActive" | "newest" | "alphabetical";
type CategoryTab = "all" | "women" | "men" | "couples" | "gay" | "lesbian";

const categoryFilters: Record<CategoryTab, { gender?: Gender; seeking?: Seeking; orientation?: string; label: string }> = {
  all: { label: "All Members" },
  women: { gender: "Woman", label: "Women" },
  men: { gender: "Man", label: "Men" },
  couples: { gender: "Couple", label: "Couples" },
  gay: { gender: "Man", seeking: "Man", label: "Gay" },
  lesbian: { gender: "Woman", seeking: "Woman", label: "Lesbian" },
};

// ─── Component ──────────────────────────────────────────────────────
const DatingPage = () => {
  const { isDatingLoggedIn, datingUser, datingLogout, setShowDatingAuthModal } = useDatingAuth();

  // Pending filter state (what user picks before hitting Search)
  const [pendingIAm, setPendingIAm] = useState<string>("any");
  const [pendingLookingFor, setPendingLookingFor] = useState<string>("any");
  const [pendingDistrict, setPendingDistrict] = useState<string>("any");
  const [pendingAgeMin, setPendingAgeMin] = useState("");
  const [pendingAgeMax, setPendingAgeMax] = useState("");
  const [pendingSortBy, setPendingSortBy] = useState<SortOption>("lastActive");
  const [pendingSearchQuery, setPendingSearchQuery] = useState("");

  // Applied filter state (what actually drives results)
  const [searchQuery, setSearchQuery] = useState("");
  const [iAmFilter, setIAmFilter] = useState<string>("any");
  const [lookingForFilter, setLookingForFilter] = useState<string>("any");
  const [districtFilter, setDistrictFilter] = useState<string>("any");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("lastActive");

  const [categoryTab, setCategoryTab] = useState<CategoryTab>("all");
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Category slider ref
  const sliderRef = useRef<HTMLDivElement>(null);

  const allProfiles = useMemo(() => getAllPublicProfiles(), []);
  const totalMembersCount = useMemo(() => 24000 + allProfiles.length, [allProfiles]);

  // Execute search — copies pending state into applied state
  const handleSearch = () => {
    setSearchQuery(pendingSearchQuery);
    setIAmFilter(pendingIAm);
    setLookingForFilter(pendingLookingFor);
    setDistrictFilter(pendingDistrict);
    setAgeMin(pendingAgeMin);
    setAgeMax(pendingAgeMax);
    setSortBy(pendingSortBy);
    setPage(1);
    setFiltersOpen(false);
  };

  const handleResetFilters = () => {
    setPendingIAm("any");
    setPendingLookingFor("any");
    setPendingDistrict("any");
    setPendingAgeMin("");
    setPendingAgeMax("");
    setPendingSortBy("lastActive");
    setPendingSearchQuery("");
    setSearchQuery("");
    setIAmFilter("any");
    setLookingForFilter("any");
    setDistrictFilter("any");
    setAgeMin("");
    setAgeMax("");
    setSortBy("lastActive");
    setPage(1);
  };

  // Count active filters
  const activeFilterCount = [
    iAmFilter !== "any",
    lookingForFilter !== "any",
    districtFilter !== "any",
    ageMin !== "",
    ageMax !== "",
    searchQuery.trim() !== "",
    sortBy !== "lastActive",
  ].filter(Boolean).length;

  // Apply filters
  const filteredProfiles = useMemo(() => {
    let list = [...allProfiles];

    if (datingUser) {
      list = list.filter((p) => p.id !== datingUser.id);
    }

    const cat = categoryFilters[categoryTab];
    if (cat.gender) list = list.filter((p) => p.gender === cat.gender);
    if (cat.seeking) list = list.filter((p) => p.seeking === cat.seeking);

    if (iAmFilter !== "any") list = list.filter((p) => p.gender === iAmFilter);
    if (lookingForFilter !== "any") list = list.filter((p) => p.seeking === lookingForFilter);
    if (districtFilter !== "any") list = list.filter((p) => p.district === districtFilter);

    const minAge = ageMin ? parseInt(ageMin) : 0;
    const maxAge = ageMax ? parseInt(ageMax) : 999;
    list = list.filter((p) => p.age >= minAge && p.age <= maxAge);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q) ||
          p.district.toLowerCase().includes(q)
      );
    }

    if (sortBy === "lastActive") {
      list.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
    } else if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [allProfiles, datingUser, categoryTab, iAmFilter, lookingForFilter, districtFilter, ageMin, ageMax, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProfiles.length / MEMBERS_PER_PAGE));
  const paginatedProfiles = filteredProfiles.slice((page - 1) * MEMBERS_PER_PAGE, page * MEMBERS_PER_PAGE);

  const handleCategoryChange = (tab: CategoryTab) => {
    setCategoryTab(tab);
    setPage(1);
    setPendingIAm("any");
    setPendingLookingFor("any");
    setIAmFilter("any");
    setLookingForFilter("any");
  };

  const scrollSlider = (dir: "left" | "right") => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: dir === "left" ? -160 : 160, behavior: "smooth" });
    }
  };

  const isRecentlyActive = (lastActive: string) => {
    const diffMs = new Date().getTime() - new Date(lastActive).getTime();
    return diffMs < 600000;
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">
            <span className="text-gradient">Dating</span>
          </h1>
          <p className="text-muted-foreground text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="font-semibold text-foreground">{totalMembersCount.toLocaleString()}+</span> active members
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isDatingLoggedIn && datingUser ? (
            <>
              <Link to="/dating/mailbox" className="relative">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Mail className="w-4 h-4" />
                  <span className="hidden sm:inline">Mailbox</span>
                </Button>
                {(() => {
                  const unread = getUnreadCount(datingUser.id);
                  return unread > 0 ? (
                    <span className="absolute -top-0.5 right-0 sm:-top-0.5 sm:right-auto sm:left-5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null;
                })()}
              </Link>
              <Link to="/dating/profile" className="relative">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <UserCircle className="w-4 h-4" /> My Profile
                </Button>
                {(() => {
                  const unread = getUnreadCount(datingUser.id);
                  return unread > 0 ? (
                    <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null;
                })()}
              </Link>
              <Button variant="ghost" size="sm" onClick={datingLogout} className="gap-1.5 text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </>
          ) : (
            <Button variant="hero" size="sm" onClick={() => setShowDatingAuthModal(true)} className="gap-1.5">
              <Heart className="w-4 h-4" /> Join / Login
            </Button>
          )}
        </div>
      </div>

      {/* Category Tabs — Horizontal Slider */}
      <div className="relative mb-6">
        <button
          onClick={() => scrollSlider("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div
          ref={sliderRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-9 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {(Object.keys(categoryFilters) as CategoryTab[]).map((key) => (
            <Button
              key={key}
              variant={categoryTab === key ? "default" : "secondary"}
              size="sm"
              onClick={() => handleCategoryChange(key)}
              className="capitalize whitespace-nowrap shrink-0"
            >
              {categoryFilters[key].label}
            </Button>
          ))}
        </div>
        <button
          onClick={() => scrollSlider("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Filter Toggle Bar + Results Count */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <Button
          variant={filtersOpen ? "default" : "secondary"}
          size="sm"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="gap-1.5"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-primary/20 text-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          {filteredProfiles.length} member{filteredProfiles.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {/* Filter Dropdown Panel */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search */}
                <div className="sm:col-span-2 lg:col-span-3 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, username, district..."
                    className="pl-10 bg-secondary border-border"
                    value={pendingSearchQuery}
                    onChange={(e) => setPendingSearchQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                  />
                </div>

                {/* I am */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">I am</label>
                  <Select value={pendingIAm} onValueChange={setPendingIAm}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Man">Man</SelectItem>
                      <SelectItem value="Woman">Woman</SelectItem>
                      <SelectItem value="Couple">Couple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Looking for */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Looking for</label>
                  <Select value={pendingLookingFor} onValueChange={setPendingLookingFor}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="Man">Man</SelectItem>
                      <SelectItem value="Woman">Woman</SelectItem>
                      <SelectItem value="Couple">Couple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">District</label>
                  <Select value={pendingDistrict} onValueChange={setPendingDistrict}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">All Districts</SelectItem>
                      {districtNames.map((d) => (
                        <SelectItem key={d} value={d}>{d.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Age range */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Age range</label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="bg-secondary border-border"
                      value={pendingAgeMin}
                      min={18}
                      onChange={(e) => setPendingAgeMin(e.target.value)}
                    />
                    <span className="text-muted-foreground text-xs shrink-0">to</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      className="bg-secondary border-border"
                      value={pendingAgeMax}
                      onChange={(e) => setPendingAgeMax(e.target.value)}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Sort by</label>
                  <Select value={pendingSortBy} onValueChange={(v) => setPendingSortBy(v as SortOption)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastActive">Last Active</SelectItem>
                      <SelectItem value="newest">Newest Registered</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
                <Button variant="hero" onClick={handleSearch} className="gap-1.5">
                  <Search className="w-4 h-4" /> Search
                </Button>
                <Button variant="ghost" size="sm" onClick={handleResetFilters} className="gap-1.5 text-muted-foreground">
                  <X className="w-4 h-4" /> Reset
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Members Grid */}
      {paginatedProfiles.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No members match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {paginatedProfiles.map((profile, i) => (
            <React.Fragment key={profile.id}>
              <MemberCard profile={profile} index={i} isOnline={isRecentlyActive(profile.lastActive)} />
              {/* Rotating ad every 4 members – spans full grid width */}
              {(i + 1) % 4 === 0 && (
                <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5">
                  <RotatingAdSpace slotKey="dating-in-content" index={Math.floor(i / 4)} className="flex justify-center py-2" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .map((p, idx, arr) => {
              const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
              return (
                <span key={p} className="flex items-center">
                  {showEllipsis && <span className="text-muted-foreground px-1">...</span>}
                  <Button
                    variant={p === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setPage(p)}
                    className="min-w-[36px]"
                  >
                    {p}
                  </Button>
                </span>
              );
            })}
          <Button
            variant="ghost"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

// ─── Member Card ────────────────────────────────────────────────────
function MemberCard({ profile, index, isOnline }: { profile: DatingProfile; index: number; isOnline: boolean }) {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="bg-card rounded-lg border border-border overflow-hidden hover-glow hover:border-primary/40 transition-all cursor-pointer group"
    >
      {/* Avatar area */}
      <div className="relative h-32 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
        {profile.profilePhoto ? (
          <img
            src={profile.profilePhoto}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-display font-bold text-primary group-hover:scale-110 transition-transform">
            {profile.name[0]}
          </div>
        )}
        {/* Online indicator */}
        {isOnline && (
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-green-500 border-2 border-card" title="Online now" />
        )}
        {/* Gender badge */}
        <span className="absolute bottom-2 left-2 text-[10px] font-semibold bg-background/80 backdrop-blur px-1.5 py-0.5 rounded text-muted-foreground">
          {profile.gender}
        </span>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-display font-semibold text-sm text-foreground truncate">
          {profile.name}, {profile.age}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{profile.district.replace("_", " ")}</span>
        </p>
        <p className="text-[10px] text-muted-foreground/70 flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 shrink-0" />
          {formatLastActive(profile.lastActive)}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1 truncate">
          Seeking: {profile.seeking}
        </p>
      </div>
    </motion.div>
  );

  return <Link to={`/dating/member/${profile.id}`}>{cardContent}</Link>;
}

export default DatingPage;
