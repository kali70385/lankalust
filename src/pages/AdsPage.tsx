import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import AdSearchFilter from "@/components/AdSearchFilter";
import AdListItem from "@/components/AdListItem";
import { RotatingAdSpace } from "@/components/AdSpace";
import { categoryTabs } from "@/data/mockAds";
import { getAllAds } from "@/data/unifiedAds";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ADS_PER_PAGE = 16;

// Map URL ?cat= codes to category tab names
const catParamToTab: Record<string, string> = {
  male: "Male Personals",
  female: "Female Personals",
  massage: "Massage",
  livecam: "Live Cam",
  toys: "Toys",
  jobs: "Jobs",
  hotels: "Hotel/Rooms",
  other: "Other",
};

const AdsPage = () => {
  const [searchParams] = useSearchParams();
  const catParam = searchParams.get("cat") || "";
  const initialTab = catParamToTab[catParam] || "All";

  const [activeTab, setActiveTab] = useState(initialTab);
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

  // Sync tab when URL ?cat= param changes (e.g. navigating from homepage categories)
  useEffect(() => {
    const tab = catParamToTab[catParam] || "All";
    setActiveTab(tab);
    setPage(1);
  }, [catParam]);

  const handleSearch = () => {
    setAppliedSearch(search);
    setAppliedDistrict(district);
    setAppliedCity(city);
    setPage(1);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const allAds = getAllAds();

  const filtered = allAds.filter((ad) => {
    if (activeTab !== "All" && ad.category !== activeTab) return false;
    if (appliedSearch && !ad.title.toLowerCase().includes(appliedSearch.toLowerCase()) && !ad.description.toLowerCase().includes(appliedSearch.toLowerCase())) return false;
    if (appliedDistrict !== "all" && ad.district !== appliedDistrict) return false;
    if (appliedCity !== "all" && ad.city !== appliedCity) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ADS_PER_PAGE));
  const paginatedAds = filtered.slice((page - 1) * ADS_PER_PAGE, page * ADS_PER_PAGE);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Build page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-bold">
          <span className="text-gradient">Adult Ads</span>
        </h1>
        <Button variant="hero" size="sm" className="gap-1.5" onClick={handlePostAdClick}>
          <Plus className="w-4 h-4" /> Post Ad
        </Button>
      </div>

      {/* Search & Location Filter */}
      <div className="mb-6">
        <AdSearchFilter
          search={search} onSearchChange={setSearch}
          district={district} onDistrictChange={setDistrict}
          city={city} onCityChange={setCity}
          onSearch={handleSearch}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        {categoryTabs.map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "secondary"}
            size="sm"
            onClick={() => handleTabChange(tab)}
            className="whitespace-nowrap"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Results count */}
      {filtered.length > 0 && (
        <p className="text-sm text-muted-foreground mb-4">
          Showing {(page - 1) * ADS_PER_PAGE + 1}–{Math.min(page * ADS_PER_PAGE, filtered.length)} of {filtered.length} ads
        </p>
      )}

      {/* Ads list */}
      <div className="flex flex-col gap-3">
        {paginatedAds.map((ad, i) => (
          <React.Fragment key={ad.id}>
            <AdListItem ad={ad} index={i} />
            {/* Rotating ad every 4 items */}
            {(i + 1) % 4 === 0 && (
              <RotatingAdSpace slotKey="category-in-content" index={Math.floor(i / 4)} className="flex justify-center py-2" />
            )}
          </React.Fragment>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">No ads found matching your filters.</p>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Button>

          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-2 text-muted-foreground text-sm">…</span>
            ) : (
              <Button
                key={p}
                variant={page === p ? "default" : "secondary"}
                size="sm"
                onClick={() => setPage(p as number)}
                className="min-w-[36px]"
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdsPage;

