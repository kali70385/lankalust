import { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Shield, Users, Heart, MessageCircle, BookOpen, Trash2, Eye,
  Search, RefreshCw, Mail, ChevronLeft, ChevronRight,
  AlertTriangle, Settings, Database, BarChart3, Plus, Edit, UserX, ImagePlus, X,
  Megaphone, ToggleLeft, ToggleRight, Save, Copy, Check,
} from "lucide-react";

// ─── Data imports ────────────────────────────────────────────────────
import { userAdsStore } from "@/data/userAdsStore";
import { getAllAds, type UnifiedAd } from "@/data/unifiedAds";
import {
  getDatingUsers, saveDatingUsers, type DatingProfile,
} from "@/data/datingProfiles";
import { type DatingMessage } from "@/data/datingMessages";
import {
  getAllStories, addStory, updateStory, deleteStory, resetStories,
  walkathaCategories, type Story,
} from "@/data/storiesStore";
import {
  getAdSpaces, saveAdSpaces, loadSampleAds, clearAllAds, type AdSpaceSlot,
} from "@/data/adSpacesStore";

// ─── Constants ───────────────────────────────────────────────────────
const USERS_KEY = "lankalust_users";
const DATING_MESSAGES_KEY = "lankalust_dating_messages";
const PAGE_SIZE = 10;

// ─── Helper: read main users from localStorage ──────────────────────
interface StoredUser {
  username: string;
  phone: string;
  password: string;
}
function getMainUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveMainUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ─── Helper: read/write dating messages directly ────────────────────
function getAllDatingMessages(): DatingMessage[] {
  try { return JSON.parse(localStorage.getItem(DATING_MESSAGES_KEY) || "[]"); } catch { return []; }
}
function saveDatingMessages(msgs: DatingMessage[]) {
  localStorage.setItem(DATING_MESSAGES_KEY, JSON.stringify(msgs));
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN PAGE
// ═══════════════════════════════════════════════════════════════════════
const AdminPage = () => {
  const { user, isAdmin, setShowAuthModal } = useAuth();

  // ── Gate: must be logged in as admin ──
  if (!user || !isAdmin) {
    return (
      <div className="container py-20 text-center">
        <Shield className="w-16 h-16 text-primary mx-auto mb-4 opacity-40" />
        <h1 className="text-2xl font-display font-bold mb-2">Admin Access Required</h1>
        <p className="text-muted-foreground mb-6">Please log in with admin credentials to access this panel.</p>
        <Button variant="hero" onClick={() => setShowAuthModal(true)}>Log In</Button>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <Shield className="w-7 h-7 text-primary" />
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          <span className="text-gradient">Admin Panel</span>
        </h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Full control over LankaLust systems. Logged in as <span className="text-primary font-medium">{user.username}</span></p>

      {/* Stats Bar */}
      <StatsBar />

      {/* System Tabs */}
      <Tabs defaultValue="users" className="mt-6">
        <TabsList className="w-full grid grid-cols-6 h-auto">
          <TabsTrigger value="users" className="gap-1.5 text-xs sm:text-sm py-2">
            <Users className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="ads" className="gap-1.5 text-xs sm:text-sm py-2">
            <Settings className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ads</span>
          </TabsTrigger>
          <TabsTrigger value="dating" className="gap-1.5 text-xs sm:text-sm py-2">
            <Heart className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Dating</span>
          </TabsTrigger>
          <TabsTrigger value="walkatha" className="gap-1.5 text-xs sm:text-sm py-2">
            <BookOpen className="w-3.5 h-3.5" /> <span className="hidden sm:inline">WalKatha</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="gap-1.5 text-xs sm:text-sm py-2">
            <MessageCircle className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="adspaces" className="gap-1.5 text-xs sm:text-sm py-2">
            <Megaphone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ad Spaces</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users"><UsersSection /></TabsContent>
        <TabsContent value="ads"><AdsSection /></TabsContent>
        <TabsContent value="dating"><DatingSection /></TabsContent>
        <TabsContent value="walkatha"><WalkathaSection /></TabsContent>
        <TabsContent value="chat"><ChatSection /></TabsContent>
        <TabsContent value="adspaces"><AdSpacesSection /></TabsContent>
      </Tabs>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// STATS BAR
// ═══════════════════════════════════════════════════════════════════════
const StatsBar = () => {
  const mainUsers = getMainUsers();
  const datingUsers = getDatingUsers();
  const allAds = getAllAds();
  const datingMsgs = getAllDatingMessages();
  const stories = getAllStories();

  const stats = [
    { label: "Main Users", value: mainUsers.length, icon: Users, color: "text-blue-400" },
    { label: "Total Ads", value: allAds.length, icon: BarChart3, color: "text-green-400" },
    { label: "Dating Profiles", value: datingUsers.length, icon: Heart, color: "text-pink-400" },
    { label: "Dating Messages", value: datingMsgs.length, icon: Mail, color: "text-amber-400" },
    { label: "Stories", value: stories.length, icon: BookOpen, color: "text-purple-400" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-card border border-border rounded-lg p-3 text-center">
          <s.icon className={`w-5 h-5 mx-auto mb-1 ${s.color}`} />
          <p className="text-lg font-bold">{s.value}</p>
          <p className="text-[10px] text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// USERS SECTION (Main / Ad‑system users)
// ═══════════════════════════════════════════════════════════════════════
const UsersSection = () => {
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<StoredUser | null>(null);
  const [viewTarget, setViewTarget] = useState<StoredUser | null>(null);

  const reload = () => setUsers(getMainUsers());
  useEffect(reload, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter((u) => u.username.toLowerCase().includes(q) || u.phone.includes(q));
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (u: StoredUser) => {
    // Remove user
    const remaining = getMainUsers().filter((x) => x.username.toLowerCase() !== u.username.toLowerCase());
    saveMainUsers(remaining);
    // Remove all their ads
    const userAds = userAdsStore.getByUser(u.username);
    userAds.forEach((ad) => userAdsStore.delete(ad.id));
    toast.success(`User "${u.username}" and their ${userAds.length} ad(s) deleted.`);
    setDeleteTarget(null);
    reload();
  };

  const handleDeleteAll = () => {
    saveMainUsers([]);
    toast.success("All users deleted.");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Manage Users</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={reload} className="gap-1"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          {users.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteAll} className="gap-1"><Trash2 className="w-3.5 h-3.5" /> Delete All</Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by username or phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-secondary border-border" />
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} user(s) — Page {page} of {totalPages}</p>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
                <th className="text-left p-3">Username</th>
                <th className="text-left p-3">Phone</th>
                <th className="text-left p-3 hidden sm:table-cell">Ads</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((u) => {
                const adCount = userAdsStore.getByUser(u.username).length;
                return (
                  <tr key={u.username} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-medium">{u.username}</td>
                    <td className="p-3 text-muted-foreground">{u.phone}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-[10px]">{adCount} ad{adCount !== 1 ? "s" : ""}</Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setViewTarget(u)} className="h-7 w-7 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(u)} className="h-7 w-7 p-0 text-destructive hover:text-destructive"><UserX className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {paged.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* View Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Main system user info</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Username:</span> {viewTarget.username}</p>
              <p><span className="text-muted-foreground">Phone:</span> {viewTarget.phone}</p>
              <p><span className="text-muted-foreground">Ads posted:</span> {userAdsStore.getByUser(viewTarget.username).length}</p>
              <div className="mt-3">
                <p className="text-muted-foreground text-xs mb-1">Their ads:</p>
                {userAdsStore.getByUser(viewTarget.username).length === 0 ? (
                  <p className="text-xs text-muted-foreground/60 italic">No ads posted</p>
                ) : (
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {userAdsStore.getByUser(viewTarget.username).map((ad) => (
                      <div key={ad.id} className="bg-secondary/50 rounded p-2 text-xs flex items-center justify-between gap-2">
                        <span className="truncate">{ad.title}</span>
                        <Badge variant="outline" className="text-[9px] shrink-0">{ad.category}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delete User</DialogTitle>
            <DialogDescription>This will also remove all ads posted by this user.</DialogDescription>
          </DialogHeader>
          <p className="text-sm">Delete user "<span className="font-medium">{deleteTarget?.username}</span>" and all their ads?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// ADS SECTION
// ═══════════════════════════════════════════════════════════════════════
const AdsSection = () => {
  const [ads, setAds] = useState<UnifiedAd[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<UnifiedAd | null>(null);
  const [viewTarget, setViewTarget] = useState<UnifiedAd | null>(null);

  const reload = () => { setAds(getAllAds()); };
  useEffect(reload, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return ads;
    const q = search.toLowerCase();
    return ads.filter(
      (a) => a.title.toLowerCase().includes(q) || a.username?.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );
  }, [ads, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (ad: UnifiedAd) => {
    if (ad.source === "user") {
      userAdsStore.delete(ad.id);
      toast.success("Ad deleted.");
    } else {
      toast.error("Mock/demo ads cannot be deleted.");
    }
    setDeleteTarget(null);
    reload();
  };

  const handleDeleteAllUserAds = () => {
    const userAds = ads.filter((a) => a.source === "user");
    userAds.forEach((a) => userAdsStore.delete(a.id));
    toast.success(`${userAds.length} user ad(s) deleted.`);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> Manage Ads</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={reload} className="gap-1"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          {ads.some((a) => a.source === "user") && (
            <Button variant="destructive" size="sm" onClick={handleDeleteAllUserAds} className="gap-1"><Trash2 className="w-3.5 h-3.5" /> Clear User Ads</Button>
          )}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search ads by title, user, category..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-secondary border-border" />
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} ad(s) total — Page {page} of {totalPages}</p>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3 hidden sm:table-cell">User</th>
                <th className="text-left p-3 hidden md:table-cell">Category</th>
                <th className="text-left p-3 hidden md:table-cell">Source</th>
                <th className="text-left p-3 hidden lg:table-cell">Time</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((ad) => (
                <tr key={ad.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 max-w-[200px] truncate font-medium">{ad.title}</td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">{ad.username || "—"}</td>
                  <td className="p-3 hidden md:table-cell"><Badge variant="secondary" className="text-[10px]">{ad.category}</Badge></td>
                  <td className="p-3 hidden md:table-cell">
                    <Badge variant={ad.source === "user" ? "default" : "outline"} className="text-[10px]">{ad.source}</Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">{ad.time}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setViewTarget(ad)} className="h-7 w-7 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                      {ad.source === "user" && (
                        <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(ad)} className="h-7 w-7 p-0 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No ads found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* View Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewTarget?.title}</DialogTitle>
            <DialogDescription>Ad details</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">ID:</span> {viewTarget.id}</p>
              <p><span className="text-muted-foreground">User:</span> {viewTarget.username || "N/A"}</p>
              <p><span className="text-muted-foreground">Category:</span> {viewTarget.category}</p>
              <p><span className="text-muted-foreground">Location:</span> {viewTarget.district}, {viewTarget.city}</p>
              <p><span className="text-muted-foreground">Contact:</span> {viewTarget.contact || "N/A"}</p>
              <p><span className="text-muted-foreground">Description:</span></p>
              <p className="bg-secondary/50 rounded p-2 text-xs whitespace-pre-wrap">{viewTarget.description}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delete Ad</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <p className="text-sm">Are you sure you want to delete "<span className="font-medium">{deleteTarget?.title}</span>"?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// CHAT SECTION
// ═══════════════════════════════════════════════════════════════════════
const ChatSection = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-display font-bold">Chat System</h2>
      </div>

      <div className="bg-card border border-border rounded-lg p-5">
        <p className="text-sm text-muted-foreground mb-4">
          The chat system operates in-memory — messages and users are not persisted to storage and reset on page refresh.
          Admin controls for the chat system are limited to system-level actions.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Database className="w-4 h-4 text-primary" /> Chat Rooms</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /> Public Chat</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500" /> Boys Chat</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-pink-500" /> Girls Chat</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500" /> Couples Chat</li>
            </ul>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 border border-border">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2"><Settings className="w-4 h-4 text-primary" /> System Info</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>Storage: In-memory (volatile)</li>
              <li>Features: Public rooms, private DMs, emoji, images</li>
              <li>Auth: Per-session login (nickname-based)</li>
              <li>Avatars: Client-side upload with compression</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-xs text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Chat data is volatile. To implement moderation (banning, message deletion), the chat system would need a persistent backend.
          </p>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// DATING SECTION
// ═══════════════════════════════════════════════════════════════════════
const DatingSection = () => {
  const [activeTab, setActiveTab] = useState<"profiles" | "messages">("profiles");
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Heart className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-display font-bold">Dating System</h2>
      </div>
      <div className="flex gap-2 mb-2">
        <Button variant={activeTab === "profiles" ? "default" : "secondary"} size="sm" onClick={() => setActiveTab("profiles")} className="gap-1"><Users className="w-3.5 h-3.5" /> Profiles</Button>
        <Button variant={activeTab === "messages" ? "default" : "secondary"} size="sm" onClick={() => setActiveTab("messages")} className="gap-1"><Mail className="w-3.5 h-3.5" /> Messages</Button>
      </div>
      {activeTab === "profiles" ? <DatingProfilesPanel /> : <DatingMessagesPanel />}
    </div>
  );
};

// ── Dating Profiles Panel ──
const DatingProfilesPanel = () => {
  const [profiles, setProfiles] = useState<DatingProfile[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<DatingProfile | null>(null);
  const [viewTarget, setViewTarget] = useState<DatingProfile | null>(null);

  const reload = () => { setProfiles(getDatingUsers()); };
  useEffect(reload, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return profiles;
    const q = search.toLowerCase();
    return profiles.filter(
      (p) => p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.district.toLowerCase().includes(q)
    );
  }, [profiles, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (profile: DatingProfile) => {
    const users = getDatingUsers().filter((u) => u.id !== profile.id);
    saveDatingUsers(users);
    const msgs = getAllDatingMessages().filter((m) => m.fromUserId !== profile.id && m.toUserId !== profile.id);
    saveDatingMessages(msgs);
    toast.success(`Profile "${profile.name}" deleted.`);
    setDeleteTarget(null);
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} profile(s)</p>
        <Button variant="ghost" size="sm" onClick={reload} className="gap-1"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name, username, district..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-secondary border-border" />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3 hidden sm:table-cell">Username</th>
                <th className="text-left p-3 hidden md:table-cell">Age/Gender</th>
                <th className="text-left p-3 hidden md:table-cell">Seeking</th>
                <th className="text-left p-3 hidden lg:table-cell">District</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 font-medium flex items-center gap-2">
                    {p.profilePhoto ? (
                      <img src={p.profilePhoto} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">{p.name[0]}</div>
                    )}
                    {p.name}
                  </td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">{p.username}</td>
                  <td className="p-3 hidden md:table-cell">{p.age} · {p.gender}</td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{p.seeking}</td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground">{p.district}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setViewTarget(p)} className="h-7 w-7 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(p)} className="h-7 w-7 p-0 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No profiles found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* View Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewTarget?.name}'s Profile</DialogTitle>
            <DialogDescription>Dating profile details</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3 mb-3">
                {viewTarget.profilePhoto ? (
                  <img src={viewTarget.profilePhoto} alt="" className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">{viewTarget.name[0]}</div>
                )}
                <div>
                  <p className="font-semibold">{viewTarget.name}</p>
                  <p className="text-xs text-muted-foreground">@{viewTarget.username}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <p><span className="text-muted-foreground">Age:</span> {viewTarget.age}</p>
                <p><span className="text-muted-foreground">Gender:</span> {viewTarget.gender}</p>
                <p><span className="text-muted-foreground">Seeking:</span> {viewTarget.seeking}</p>
                <p><span className="text-muted-foreground">District:</span> {viewTarget.district}</p>
                <p><span className="text-muted-foreground">Marital:</span> {viewTarget.maritalStatus}</p>
                <p><span className="text-muted-foreground">Orientation:</span> {viewTarget.sexualOrientation}</p>
              </div>
              {viewTarget.aboutMe && (
                <>
                  <p className="text-muted-foreground text-xs mt-2">About Me:</p>
                  <p className="bg-secondary/50 rounded p-2 text-xs whitespace-pre-wrap">{viewTarget.aboutMe}</p>
                </>
              )}
              {viewTarget.interests && (
                <p className="text-xs"><span className="text-muted-foreground">Interests:</span> {viewTarget.interests}</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-2">ID: {viewTarget.id} · Created: {new Date(viewTarget.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delete Profile</DialogTitle>
            <DialogDescription>This will also delete all their messages.</DialogDescription>
          </DialogHeader>
          <p className="text-sm">Delete "<span className="font-medium">{deleteTarget?.name}</span>" (@{deleteTarget?.username})?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ── Dating Messages Panel ──
const DatingMessagesPanel = () => {
  const [messages, setMessages] = useState<DatingMessage[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<DatingMessage | null>(null);
  const [viewTarget, setViewTarget] = useState<DatingMessage | null>(null);

  const reload = () => { setMessages(getAllDatingMessages()); };
  useEffect(reload, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return messages;
    const q = search.toLowerCase();
    return messages.filter(
      (m) => m.fromName.toLowerCase().includes(q) || m.toName.toLowerCase().includes(q) || m.body.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q)
    );
  }, [messages, search]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [filtered]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paged = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (msg: DatingMessage) => {
    const all = getAllDatingMessages().filter((m) => m.id !== msg.id);
    saveDatingMessages(all);
    toast.success("Message deleted.");
    setDeleteTarget(null);
    reload();
  };

  const handleDeleteAll = () => {
    saveDatingMessages([]);
    toast.success("All dating messages deleted.");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{filtered.length} message(s)</p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={reload} className="gap-1"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          {messages.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteAll} className="gap-1"><Trash2 className="w-3.5 h-3.5" /> Clear All</Button>
          )}
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search messages..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-secondary border-border" />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
                <th className="text-left p-3">From</th>
                <th className="text-left p-3">To</th>
                <th className="text-left p-3 hidden sm:table-cell">Subject</th>
                <th className="text-left p-3 hidden md:table-cell">Status</th>
                <th className="text-left p-3 hidden lg:table-cell">Date</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((m) => (
                <tr key={m.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 font-medium">{m.fromName}</td>
                  <td className="p-3 text-muted-foreground">{m.toName}</td>
                  <td className="p-3 hidden sm:table-cell max-w-[150px] truncate text-muted-foreground">{m.subject || "(no subject)"}</td>
                  <td className="p-3 hidden md:table-cell">
                    <Badge variant={m.read ? "secondary" : "default"} className="text-[10px]">{m.read ? "Read" : "Unread"}</Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground text-xs">{new Date(m.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setViewTarget(m)} className="h-7 w-7 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(m)} className="h-7 w-7 p-0 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No messages found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* View Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>Private message content</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">From:</span> {viewTarget.fromName} (@{viewTarget.fromUsername})</p>
              <p><span className="text-muted-foreground">To:</span> {viewTarget.toName} (@{viewTarget.toUsername})</p>
              <p><span className="text-muted-foreground">Subject:</span> {viewTarget.subject || "(none)"}</p>
              <p><span className="text-muted-foreground">Date:</span> {new Date(viewTarget.createdAt).toLocaleString()}</p>
              <p><span className="text-muted-foreground">Status:</span> {viewTarget.read ? "Read" : "Unread"}</p>
              <p className="text-muted-foreground">Body:</p>
              <div className="bg-secondary/50 rounded p-3 text-xs whitespace-pre-wrap">{viewTarget.body}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delete Message</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <p className="text-sm">Delete message from <span className="font-medium">{deleteTarget?.fromName}</span> to <span className="font-medium">{deleteTarget?.toName}</span>?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// WALKATHA SECTION — Full CRUD
// ═══════════════════════════════════════════════════════════════════════
const emptyStoryForm = { title: "", excerpt: "", content: "", category: "other", image: "" };

const WalkathaSection = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewTarget, setViewTarget] = useState<Story | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Story | null>(null);

  // Create / Edit dialog
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // null = create mode
  const [form, setForm] = useState(emptyStoryForm);
  const imgInputRef = useRef<HTMLInputElement>(null);

  const reload = () => setStories(getAllStories());
  useEffect(reload, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return stories;
    const q = search.toLowerCase();
    return stories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    );
  }, [stories, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getCatName = (slug: string) => walkathaCategories.find((c) => c.slug === slug)?.name || slug;

  // ── Image upload handler (resize + compress) ──
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 10 * 1024 * 1024) { toast.error("Image must be under 10 MB."); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 600;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.75);
        setForm((prev) => ({ ...prev, image: dataUrl }));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  // ── Open editor for creating ──
  const openCreate = () => {
    setEditingId(null);
    setForm(emptyStoryForm);
    setEditorOpen(true);
  };

  // ── Open editor for editing ──
  const openEdit = (s: Story) => {
    setEditingId(s.id);
    setForm({ title: s.title, excerpt: s.excerpt, content: s.content, category: s.category, image: s.image || "" });
    setEditorOpen(true);
  };

  // ── Save (create or update) ──
  const handleSave = () => {
    if (!form.title.trim()) { toast.error("Title is required."); return; }
    if (!form.content.trim()) { toast.error("Content is required."); return; }

    const storyData = {
      title: form.title.trim(),
      author: "Admin",
      excerpt: form.excerpt.trim() || form.content.trim().slice(0, 60) + "...",
      content: form.content.trim(),
      category: form.category,
      image: form.image || undefined,
    };

    if (editingId !== null) {
      updateStory(editingId, storyData);
      toast.success("Story updated.");
    } else {
      addStory(storyData);
      toast.success("Story created.");
    }
    setEditorOpen(false);
    reload();
  };

  // ── Delete ──
  const handleDelete = (s: Story) => {
    deleteStory(s.id);
    toast.success(`Story "${s.title}" deleted.`);
    setDeleteTarget(null);
    reload();
  };

  // ── Reset to mock data ──
  const handleReset = () => {
    resetStories();
    toast.success("Stories reset to default data.");
    reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-bold flex items-center gap-2"><BookOpen className="w-4 h-4 text-primary" /> Manage WalKatha Stories</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={reload} className="gap-1"><RefreshCw className="w-3.5 h-3.5" /> Refresh</Button>
          <Button variant="secondary" size="sm" onClick={handleReset} className="gap-1"><Database className="w-3.5 h-3.5" /> Reset</Button>
          <Button variant="default" size="sm" onClick={openCreate} className="gap-1"><Plus className="w-3.5 h-3.5" /> New Story</Button>
        </div>
      </div>

      {/* Categories overview */}
      <div className="flex flex-wrap gap-1.5">
        {walkathaCategories.map((cat) => {
          const count = stories.filter((s) => s.category === cat.slug).length;
          return (
            <Badge key={cat.slug} variant="outline" className="text-[10px]">
              {cat.name} ({count})
            </Badge>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search stories..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-secondary border-border" />
      </div>

      <p className="text-xs text-muted-foreground">{filtered.length} story/stories — Page {page} of {totalPages}</p>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
                <th className="text-left p-3">Image</th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3 hidden md:table-cell">Category</th>
                <th className="text-left p-3 hidden md:table-cell">Views</th>
                <th className="text-left p-3 hidden lg:table-cell">Likes</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-3 w-12">
                    {s.image ? (
                      <img src={s.image} alt="" className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center"><BookOpen className="w-4 h-4 text-muted-foreground/40" /></div>
                    )}
                  </td>
                  <td className="p-3 font-medium max-w-[200px] truncate">{s.title}</td>
                  <td className="p-3 hidden md:table-cell"><Badge variant="secondary" className="text-[10px]">{getCatName(s.category)}</Badge></td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{s.views.toLocaleString()}</td>
                  <td className="p-3 hidden lg:table-cell text-muted-foreground">{s.likes}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setViewTarget(s)} className="h-7 w-7 p-0"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)} className="h-7 w-7 p-0"><Edit className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(s)} className="h-7 w-7 p-0 text-destructive hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No stories found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {/* View Dialog */}
      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewTarget?.title}</DialogTitle>
            <DialogDescription>Story details</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-2 text-sm">
              {viewTarget.image && (
                <img src={viewTarget.image} alt="" className="w-full h-40 object-cover rounded-lg" />
              )}
              <p><span className="text-muted-foreground">Category:</span> {getCatName(viewTarget.category)}</p>
              <p><span className="text-muted-foreground">Views:</span> {viewTarget.views.toLocaleString()} · <span className="text-muted-foreground">Likes:</span> {viewTarget.likes}</p>
              <p className="text-muted-foreground">Content:</p>
              <div className="bg-secondary/50 rounded p-3 text-xs whitespace-pre-wrap max-h-60 overflow-y-auto">{viewTarget.content}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? "Edit Story" : "New Story"}</DialogTitle>
            <DialogDescription>{editingId !== null ? "Update the story details below." : "Fill in the details to create a new story."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {/* Image upload */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Story Image <span className="text-muted-foreground/60">(optional)</span></label>
              <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              {form.image ? (
                <div className="relative inline-block">
                  <img src={form.image} alt="" className="w-full h-36 object-cover rounded-lg border border-border" />
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imgInputRef.current?.click()}
                  className="w-full h-28 rounded-lg border-2 border-dashed border-border bg-secondary/30 flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <ImagePlus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Click to upload image</span>
                </button>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Title *</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Story title" className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Category *</label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {walkathaCategories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Excerpt <span className="text-muted-foreground/60">(auto-generated if empty)</span></label>
              <Input value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short preview text..." className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Content *</label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Write the full story here..."
                rows={8}
                className="bg-secondary border-border resize-y"
              />
              <p className="text-[10px] text-muted-foreground mt-1">{form.content.length} characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleSave}>{editingId !== null ? "Save Changes" : "Create Story"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-destructive" /> Delete Story</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <p className="text-sm">Delete story "<span className="font-medium">{deleteTarget?.title}</span>"?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteTarget && handleDelete(deleteTarget)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// AD SPACES SECTION
// ═══════════════════════════════════════════════════════════════════════
const AdSpacesSection = () => {
  const [slots, setSlots] = useState<AdSpaceSlot[]>([]);
  const [editingSlot, setEditingSlot] = useState<AdSpaceSlot | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [filterArea, setFilterArea] = useState("all");

  const reload = () => setSlots(getAdSpaces());
  useEffect(() => { reload(); }, []);

  const areas = useMemo(() => {
    const set = new Set(slots.map((s) => s.area));
    return Array.from(set);
  }, [slots]);

  const filtered = filterArea === "all" ? slots : slots.filter((s) => s.area === filterArea);

  const enabledCount = slots.filter((s) => s.enabled).length;
  const allEnabled = slots.length > 0 && enabledCount === slots.length;

  const toggleAll = () => {
    const newState = !allEnabled;
    const updated = slots.map((s) => ({ ...s, enabled: newState }));
    setSlots(updated);
    saveAdSpaces(updated);
    toast.success(newState ? "All ad spaces enabled." : "All ad spaces disabled.");
  };

  const toggleEnabled = (key: string) => {
    const updated = slots.map((s) =>
      s.key === key ? { ...s, enabled: !s.enabled } : s
    );
    setSlots(updated);
    saveAdSpaces(updated);
    toast.success("Slot updated.");
  };

  const openEditor = (slot: AdSpaceSlot) => {
    setEditingSlot({ ...slot, codes: [...slot.codes] });
    setEditorOpen(true);
  };

  const handleSaveSlot = () => {
    if (!editingSlot) return;
    const updated = slots.map((s) =>
      s.key === editingSlot.key ? editingSlot : s
    );
    setSlots(updated);
    saveAdSpaces(updated);
    setEditorOpen(false);
    toast.success(`"${editingSlot.label}" saved.`);
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-primary" /> Ad Spaces
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {enabledCount} of {slots.length} slots enabled
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={() => { loadSampleAds(); reload(); toast.success("Sample ads loaded & enabled."); }}
          >
            <Plus className="w-3.5 h-3.5" /> Load Samples
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 h-8 text-xs text-muted-foreground"
            onClick={() => { clearAllAds(); reload(); toast.success("All ad codes cleared & disabled."); }}
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </Button>
          <Button
            variant={allEnabled ? "destructive" : "default"}
            size="sm"
            className="gap-1.5 h-8 text-xs"
            onClick={toggleAll}
          >
            {allEnabled ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
            {allEnabled ? "Disable All" : "Enable All"}
          </Button>
          <Select value={filterArea} onValueChange={setFilterArea}>
            <SelectTrigger className="w-32 h-8 text-xs bg-secondary border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              {areas.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50 text-xs text-muted-foreground">
              <th className="text-left p-3">Slot</th>
              <th className="text-left p-3 hidden md:table-cell">Area</th>
              <th className="text-left p-3 hidden lg:table-cell">Type</th>
              <th className="text-center p-3 hidden sm:table-cell">Size</th>
              <th className="text-center p-3">Status</th>
              <th className="text-center p-3 hidden sm:table-cell">Codes</th>
              <th className="text-right p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((slot) => {
              const filledCodes = slot.codes.filter((c) => c.trim()).length;
              return (
                <tr key={slot.key} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-foreground text-sm">{slot.label}</p>
                      <button
                        onClick={() => handleCopyKey(slot.key)}
                        className="text-[10px] text-muted-foreground/60 font-mono flex items-center gap-1 hover:text-primary transition-colors mt-0.5"
                        title="Copy slot key"
                      >
                        {slot.key}
                        {copied === slot.key ? (
                          <Check className="w-2.5 h-2.5 text-green-400" />
                        ) : (
                          <Copy className="w-2.5 h-2.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <Badge variant="secondary" className="text-[10px]">{slot.area}</Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${slot.type === "rotating" ? "bg-amber-500/15 text-amber-400" : "bg-blue-500/15 text-blue-400"}`}>
                      {slot.type === "rotating" ? `Rotating (${slot.codes.length})` : "Single"}
                    </span>
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">
                    <span className="text-[10px] font-mono text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded">{slot.size}</span>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => toggleEnabled(slot.key)} className="inline-flex items-center" title={slot.enabled ? "Disable" : "Enable"}>
                      {slot.enabled ? (
                        <ToggleRight className="w-6 h-6 text-green-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-muted-foreground/40" />
                      )}
                    </button>
                  </td>
                  <td className="p-3 text-center hidden sm:table-cell">
                    <span className={`text-xs font-medium ${filledCodes > 0 ? "text-green-400" : "text-muted-foreground/40"}`}>
                      {filledCodes}/{slot.codes.length}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => openEditor(slot)}>
                      <Edit className="w-3 h-3" /> Edit
                    </Button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No ad slots found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Info box */}
      <div className="bg-secondary/30 rounded-lg border border-border p-4 text-xs text-muted-foreground space-y-1.5">
        <p className="font-medium text-foreground text-sm mb-1.5">How to use</p>
        <p>1. Click <strong>Edit</strong> on any slot to paste your ad code (HTML, JS, AdSense, etc.)</p>
        <p>2. Toggle the slot <strong>On</strong> to activate it on the site.</p>
        <p>3. <strong>Rotating</strong> slots accept up to 4 codes that cycle per position in the feed (1, 2, 3, 4, 1, 2, 3, 4...).</p>
        <p>4. <strong>Single</strong> slots show one ad code in a fixed position.</p>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-primary" />
              {editingSlot?.label}
            </DialogTitle>
            <DialogDescription>
              Paste your ad code (HTML/JS) below. {editingSlot?.type === "rotating" ? "Fill up to 4 codes that rotate in the feed (1→2→3→4→1...)." : "Single code for this placement."}
            </DialogDescription>
          </DialogHeader>

          {editingSlot && (
            <div className="space-y-4">
              {/* Enable toggle */}
              <div className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2">
                <span className="text-sm font-medium">Enabled</span>
                <button
                  onClick={() => setEditingSlot({ ...editingSlot, enabled: !editingSlot.enabled })}
                  className="inline-flex items-center"
                >
                  {editingSlot.enabled ? (
                    <ToggleRight className="w-7 h-7 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-muted-foreground/40" />
                  )}
                </button>
              </div>

              {/* Code fields */}
              {editingSlot.codes.map((code, i) => (
                <div key={i}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {editingSlot.type === "rotating" ? `Code ${i + 1} of ${editingSlot.codes.length}` : "Ad Code"}
                  </label>
                  <Textarea
                    value={code}
                    onChange={(e) => {
                      const newCodes = [...editingSlot.codes];
                      newCodes[i] = e.target.value;
                      setEditingSlot({ ...editingSlot, codes: newCodes });
                    }}
                    placeholder="<script>...</script> or <div>...</div>"
                    className="bg-secondary border-border font-mono text-xs min-h-[100px]"
                  />
                </div>
              ))}

              {/* Slot info */}
              <div className="text-[10px] text-muted-foreground bg-secondary/30 rounded p-2 space-y-0.5">
                <p><strong>Key:</strong> {editingSlot.key}</p>
                <p><strong>Area:</strong> {editingSlot.area}</p>
                <p><strong>Type:</strong> {editingSlot.type}</p>
                <p><strong>Size:</strong> {editingSlot.size} (W×H pixels)</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="secondary" onClick={() => setEditorOpen(false)}>Cancel</Button>
            <Button variant="default" onClick={handleSaveSlot} className="gap-1.5">
              <Save className="w-3.5 h-3.5" /> Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SHARED: Pagination
// ═══════════════════════════════════════════════════════════════════════
const Pagination = ({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="gap-1 h-7 text-xs">
        <ChevronLeft className="w-3.5 h-3.5" /> Prev
      </Button>
      <span className="text-xs text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="gap-1 h-7 text-xs">
        Next <ChevronRight className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
};

export default AdminPage;
