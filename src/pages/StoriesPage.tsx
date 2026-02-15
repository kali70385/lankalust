import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Eye, Heart, Clock, Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ── Types ──
export interface Story {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  time: string;
  excerpt: string;
  image?: string;
  content: string;
  category: string;
  createdTs: number; // unix ms for sorting
}

// ── Category list ──
export const walkathaCategories = [
  { name: "BDSM", slug: "bdsm" },
  { name: "Cuckold", slug: "cuckold" },
  { name: "Gay", slug: "gay" },
  { name: "Hot Wife", slug: "hot-wife" },
  { name: "Lesbian", slug: "lesbian" },
  { name: "Massage", slug: "massage" },
  { name: "Other", slug: "other" },
  { name: "Taboo", slug: "taboo" },
  { name: "Teacher", slug: "teacher" },
  { name: "Threesome", slug: "threesome" },
];

// ── Mock data ──
export const mockStories: Story[] = [
  {
    id: 1,
    title: "රහස් හමුව",
    author: "Anonymous",
    views: 1245,
    likes: 89,
    time: "2h ago",
    excerpt: "එදා රාත්‍රියේ අපි හමුවුණා...",
    category: "taboo",
    createdTs: Date.now() - 2 * 60 * 60 * 1000,
    content:
      "එදා රාත්‍රියේ අපි හමුවුණා. සඳ එළිය පතිත වුණු ඒ මාවත දිගේ ඇවිද ගියා. කවුරුත් නැති ඒ මාවතේ අපි දෙන්නා විතරයි. හදවත් දෙකක් එකට ගැහුණා. ඔබේ ඇස් දෙකේ දිලිසුම සඳ එළියට වඩා ලස්සනයි කියලා මට හිතුණා. ඒ මොහොතේ මම ඔබට කිව්වා, 'මේ රාත්‍රිය අමතක කරන්න බැහැ' කියලා. ඔබ සිනාසුණා. ඒ සිනහව මට ජීවත් වෙන්න හේතුවක් දුන්නා.\n\nඅපි මුහුදු තීරයට ගියා. රැළි හඬ අපේ කථාබහට සංගීතයක් වුණා. වැලි කෙත්තේ වාඩිවෙලා, අහස දිහා බැලුවා. තරු ගැන කථා කලා. ජීවිතය ගැන කථා කලා. ආදරය ගැන කථා කලා.",
  },
  {
    id: 2,
    title: "මුහුදු තීරයේ",
    author: "KandyGirl",
    views: 982,
    likes: 67,
    time: "5h ago",
    excerpt: "මුහුදු සුළඟ හමනකොට...",
    category: "hot-wife",
    createdTs: Date.now() - 5 * 60 * 60 * 1000,
    content:
      "මුහුදු සුළඟ හමනකොට මගේ හිසකෙස් නටනවා. ඔහු මා දිහා බැලුවා. ඒ බැල්ම මට අමතක වෙන්නේ නැහැ. මුහුදු තීරයේ අපි දෙන්නා තනිවුණා.\n\nදිය රැළි අපේ පාද සේදුවා. සඳ එළිය මුහුද මත දිදුලුවා. ඔහු මගේ අත අල්ලාගත්තා. 'මට ඔයාව හම්බවුණේ මුහුදු තීරයේ, මගේ ජීවිතය වෙනස් වුණේ මේ මොහොතේ' කියලා ඔහු කිව්වා. මම දෙපා නැති වුණා වගේ දැනුණා. ආදරය මුහුදු රැළි වගේ. එනවා, ඉක්මනට පිටවෙනවා. නමුත් ඒ මතකය හැමදාකටම තියෙනවා.",
  },
  {
    id: 3,
    title: "ඔෆිස් එකේ රහස",
    author: "NightWriter",
    views: 2130,
    likes: 156,
    time: "1d ago",
    excerpt: "කාර්යාලයේ සැමදෙනා ගියා...",
    category: "teacher",
    createdTs: Date.now() - 24 * 60 * 60 * 1000,
    content:
      "කාර්යාලයේ සැමදෙනා ගියා. මම විතරයි ඉතුරු වුණේ. ලේට් නයිට් ව'ක් කරනකොට ඒ ඇවිල්ලා. 'ඇයි තනියෙන්?' කියලා ඇහුවා. මම සිනාසුණා.\n\nඅපි කෝපි බීලා, කාර්යාල කටයුතු ගැන කථා කලා. නමුත් ඇස් දෙකෙන් වෙනම කථාවක් පැවසුණා. 'අපි ලබන සතියේ එකට ලන්ච් යමුද?' කියලා ඇයි ඇහුවේ. මම කිව්වේ ඔව් කියලා. ඒ ඔව් මගේ ජීවිතය වෙනස් කලා.",
  },
  {
    id: 4,
    title: "පළමු අත්දැකීම",
    author: "Anonymous",
    views: 3420,
    likes: 234,
    time: "2d ago",
    excerpt: "මගේ ජීවිතයේ අමතක නොවන...",
    category: "massage",
    createdTs: Date.now() - 2 * 24 * 60 * 60 * 1000,
    content:
      "මගේ ජීවිතයේ අමතක නොවන මොහොතක්. පළමු වතාවට ආදරය දැනුණු දිනය. හදවතේ ගිනිමැළි පිපුණා. සුළඟ පවා නැවතුණා වගේ දැනුණා.\n\nඇය සිනාසුණා. ඒ සිනහව ලෝකයේ ලස්සනම දෙය. 'ඔයාට මම ආදරෙයි' කියලා කිව්වා. ඒ වචන මගේ හිතේ ගැඹුරින් කැටි වුණා. ජීවිතේ පළමු අත්දැකීම් හැමදාකටම විශේෂයි.",
  },
  {
    id: 5,
    title: "හොටෙල් කාමරය",
    author: "ColomboLover",
    views: 1876,
    likes: 145,
    time: "3d ago",
    excerpt: "දොර හැරුණු වෙලාවේ...",
    category: "cuckold",
    createdTs: Date.now() - 3 * 24 * 60 * 60 * 1000,
    content:
      "දොර හැරුණු වෙලාවේ ඇය ලස්සනටම ඇඳලා ඇවිත් හිටියා. හොටෙල් කාමරයේ ලස්සන විව් එකක් තිබුණා. කොළඹ නගරය දිදුලනවා.\n\nඅපි බැල්කනියේ සිටලා, නගරයේ ආලෝකය දිහා බැලුවා. 'මේ රාත්‍රිය අපේ විතරයි' කියලා ඇය කිව්වා. ඒ මොහොතේ ලෝකය නැවතුණා වගේ දැනුණා.",
  },
  {
    id: 6,
    title: "රාත්‍රී ගමන",
    author: "Anonymous",
    views: 1543,
    likes: 98,
    time: "4d ago",
    excerpt: "ඒ රාත්‍රියේ අපි...",
    category: "threesome",
    createdTs: Date.now() - 4 * 24 * 60 * 60 * 1000,
    content:
      "ඒ රාත්‍රියේ අපි කාර් එකේ ගියා. මාවත දිගේ තරු ආලෝකය විතරයි. ගමේ සීතල සුළඟ කාර් එකට ඇතුල් වුණා.\n\n'ඇයි මේ තරම් ලස්සන?' කියලා ඇහුවා. 'ඔයා ඉන්න නිසා' කියලා මම කිව්වා. ඒ රාත්‍රී ගමන අමතක නොවන ගමනක් වුණා. පාර නැතිවුණත් ආදරය තිබුණා.",
  },
];

// ── Component ──
const StoriesPage = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const STORIES_PER_PAGE = 5;

  // Applied filters — only update when Search is clicked
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedCategory, setAppliedCategory] = useState("all");
  const [appliedSort, setAppliedSort] = useState<"newest" | "popular">("newest");

  const handleSearch = () => {
    setAppliedSearch(searchText);
    setAppliedCategory(categoryFilter);
    setAppliedSort(sortBy);
    setCurrentPage(1);
  };

  const filteredStories = useMemo(() => {
    let result = [...mockStories];

    // Text search
    if (appliedSearch.trim()) {
      const q = appliedSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.excerpt.toLowerCase().includes(q) ||
          s.content.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (appliedCategory !== "all") {
      result = result.filter((s) => s.category === appliedCategory);
    }

    // Sort
    if (appliedSort === "newest") {
      result.sort((a, b) => b.createdTs - a.createdTs);
    } else {
      result.sort((a, b) => b.likes + b.views - (a.likes + a.views));
    }

    return result;
  }, [appliedSearch, appliedCategory, appliedSort]);

  const getCategoryName = (slug: string) =>
    walkathaCategories.find((c) => c.slug === slug)?.name || slug;

  return (
    <div className="container py-8">
      <div className="flex items-center gap-3 mb-2">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-display font-bold">
          <span className="text-gradient">WalKatha</span>
        </h1>
      </div>
      <p className="text-muted-foreground mb-6">ලංකාවේ වැඩිහිටි කථා එකතුව — Adult stories from the community.</p>

      {/* ── Search & Filter Bar ── */}
      <div className="bg-card rounded-lg border border-border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search stories..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9 bg-secondary border-border"
            />
          </div>
          {/* Category */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-44 bg-secondary border-border">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {walkathaCategories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Sort */}
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as "newest" | "popular")}>
            <SelectTrigger className="w-full sm:w-36 bg-secondary border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="popular">Popular</SelectItem>
            </SelectContent>
          </Select>
          {/* Search Button */}
          <Button variant="hero" className="gap-2 shrink-0" onClick={handleSearch}>
            <SearchIcon className="w-4 h-4" /> Search
          </Button>
        </div>
      </div>

      {/* ── Results count ── */}
      <p className="text-xs text-muted-foreground mb-4">
        {filteredStories.length} {filteredStories.length === 1 ? "story" : "stories"} found
        {appliedCategory !== "all" && <> in <span className="text-primary font-medium">{getCategoryName(appliedCategory)}</span></>}
      </p>

      {/* ── Story Cards ── */}
      <div className="grid gap-4">
        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No stories match your filters.</p>
          </div>
        )}
        {filteredStories
          .slice((currentPage - 1) * STORIES_PER_PAGE, currentPage * STORIES_PER_PAGE)
          .map((story, i) => (
            <Link to={`/story/${story.id}`} key={story.id} className="block">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-lg border border-border hover-glow hover:border-primary/40 transition-all cursor-pointer overflow-hidden"
              >
                <div className="flex">
                  {/* Image */}
                  <div className="w-28 sm:w-36 shrink-0 bg-secondary flex items-center justify-center">
                    {story.image ? (
                      <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground/40 p-4">
                        <BookOpen className="w-8 h-8" />
                        <span className="text-[9px] font-medium uppercase tracking-wider">WalKatha</span>
                      </div>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-lg text-foreground truncate">{story.title}</h3>
                        <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded capitalize shrink-0">
                          {getCategoryName(story.category)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">by {story.author}</p>
                      <p className="text-sm text-secondary-foreground line-clamp-2">{story.excerpt}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 text-xs text-muted-foreground shrink-0">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{story.views.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{story.likes}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{story.time}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
      </div>

      {/* ── Pagination ── */}
      {filteredStories.length > STORIES_PER_PAGE && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => { setCurrentPage((p) => p - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page <span className="font-semibold text-foreground">{currentPage}</span> of{" "}
            <span className="font-semibold text-foreground">{Math.ceil(filteredStories.length / STORIES_PER_PAGE)}</span>
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={currentPage >= Math.ceil(filteredStories.length / STORIES_PER_PAGE)}
            onClick={() => { setCurrentPage((p) => p + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="gap-1"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StoriesPage;
