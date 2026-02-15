import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { userAdsStore, AD_LIMITS, type UserAd } from "@/data/userAdsStore";
import { useToast } from "@/components/ui/use-toast";
import { AdSpace } from "@/components/AdSpace";
import {
    UserCircle, Phone, Plus, Pencil, Trash2, X, Check, Calendar, MapPin, Tag, AlertCircle, Shield,
} from "lucide-react";

const categories = [
    "Male Personals", "Female Personals", "Massage", "Live Cam", "Toys", "Jobs", "Hotel/Rooms", "Other"
];

const ProfilePage = () => {
    const navigate = useNavigate();
    const { user, isLoggedIn, isAdmin, setShowAuthModal } = useAuth();
    const { toast } = useToast();
    const [ads, setAds] = useState<UserAd[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ category: "", title: "", description: "", location: "", contact: "" });
    const [editError, setEditError] = useState("");

    // Load user ads
    useEffect(() => {
        if (user) {
            setAds(userAdsStore.getByUser(user.username));
        }
    }, [user]);

    // If not logged in, prompt login
    if (!isLoggedIn || !user) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-2xl font-display font-bold mb-4">Please log in to view your profile</h1>
                <p className="text-muted-foreground mb-6">You need an account to access your profile.</p>
                <Button variant="hero" size="lg" onClick={() => setShowAuthModal(true)}>
                    Login / Register
                </Button>
            </div>
        );
    }

    const startEdit = (ad: UserAd) => {
        setEditingId(ad.id);
        const catValue = categories.find(c => c === ad.category)
            ? ad.category.toLowerCase().replace(/\s|\//g, "-")
            : "";
        setEditForm({
            category: catValue,
            title: ad.title,
            description: ad.description,
            location: ad.location,
            contact: ad.contact,
        });
        setEditError("");
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditError("");
    };

    const saveEdit = (id: string) => {
        if (!editForm.title.trim() || !editForm.description.trim() || !editForm.location.trim() || !editForm.contact.trim() || !editForm.category) {
            setEditError("All fields are required.");
            return;
        }
        const categoryName = categories.find(
            (c) => c.toLowerCase().replace(/\s|\//g, "-") === editForm.category
        ) || editForm.category;

        userAdsStore.update(id, {
            category: categoryName,
            title: editForm.title.trim(),
            description: editForm.description.trim(),
            location: editForm.location.trim(),
            contact: editForm.contact.trim(),
        });
        setAds(userAdsStore.getByUser(user.username));
        setEditingId(null);
        setEditError("");
        toast({ title: "Ad Updated ✅", description: "Your changes have been saved." });
    };

    const deleteAd = (id: string) => {
        userAdsStore.delete(id);
        setAds(userAdsStore.getByUser(user.username));
        toast({ title: "Ad Deleted", description: "Your ad has been removed." });
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div className="container py-8 max-w-3xl">
            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 mb-8"
            >
                <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                            <UserCircle className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-display font-bold">{user.username}</h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Phone className="w-3.5 h-3.5" /> {user.phone}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <Button variant="secondary" className="gap-1.5" onClick={() => navigate("/admin")}>
                                <Shield className="w-4 h-4" /> Admin Panel
                            </Button>
                        )}
                        <Button variant="hero" className="gap-1.5" onClick={() => navigate("/post-ad")}>
                            <Plus className="w-4 h-4" /> Post New Ad
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* My Ads Section */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-display font-bold">
                    My <span className="text-gradient">Ads</span>
                    <span className="text-sm font-normal text-muted-foreground ml-2">({ads.length})</span>
                </h2>
            </div>

            {ads.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-card rounded-xl border border-border p-12 text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-7 h-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No ads yet</h3>
                    <p className="text-muted-foreground mb-6">You haven't posted any ads. Start by creating your first one!</p>
                    <Button variant="hero" onClick={() => navigate("/post-ad")} className="gap-1.5">
                        <Plus className="w-4 h-4" /> Post Your First Ad
                    </Button>
                </motion.div>
            ) : (
                <div className="flex flex-col gap-3">
                    <AnimatePresence>
                        {ads.map((ad, i) => (
                            <motion.div
                                key={ad.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-card rounded-xl border border-border overflow-hidden"
                            >
                                {editingId === ad.id ? (
                                    /* Edit Mode */
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-sm font-semibold text-primary">Editing Ad</h3>
                                            <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {editError && (
                                            <div className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-3 py-2 text-sm">
                                                <AlertCircle className="w-4 h-4 shrink-0" /> {editError}
                                            </div>
                                        )}

                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                                            <Select value={editForm.category} onValueChange={(v) => setEditForm({ ...editForm, category: v })}>
                                                <SelectTrigger className="bg-secondary border-border h-9 text-sm">
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(c => (
                                                        <SelectItem key={c} value={c.toLowerCase().replace(/\s|\//g, "-")}>{c}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Title</label>
                                            <Input
                                                className="bg-secondary border-border h-9 text-sm"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                                            <Textarea
                                                className="bg-secondary border-border text-sm min-h-[80px]"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                                                <Input
                                                    className="bg-secondary border-border h-9 text-sm"
                                                    value={editForm.location}
                                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-muted-foreground mb-1 block">Contact</label>
                                                <Input
                                                    className="bg-secondary border-border h-9 text-sm"
                                                    value={editForm.contact}
                                                    onChange={(e) => setEditForm({ ...editForm, contact: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 justify-end pt-1">
                                            <Button variant="secondary" size="sm" onClick={cancelEdit} className="gap-1">
                                                <X className="w-3.5 h-3.5" /> Cancel
                                            </Button>
                                            <Button variant="hero" size="sm" onClick={() => saveEdit(ad.id)} className="gap-1">
                                                <Check className="w-3.5 h-3.5" /> Save Changes
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex gap-3 flex-1 min-w-0">
                                                {ad.image && (
                                                    <img
                                                        src={ad.image}
                                                        alt={ad.title}
                                                        className="w-20 h-20 rounded-lg object-cover border border-border shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                        <span className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2.5 py-0.5">
                                                            {ad.category}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" /> {formatDate(ad.createdAt)}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-semibold mb-1 truncate">{ad.title}</h3>
                                                    {ad.price && (
                                                        <span className="text-sm font-bold text-primary mb-1 block">LKR {Number(ad.price).toLocaleString()}</span>
                                                    )}
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{ad.description}</p>
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {ad.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" /> {ad.contact}
                                                        </span>
                                                        {ad.whatsapp && <span className="text-green-500 font-medium">WhatsApp</span>}
                                                        {ad.viber && <span className="text-purple-500 font-medium">Viber</span>}
                                                        {ad.telegram && <span className="text-sky-500 font-medium">Telegram</span>}
                                                        {ad.imo && <span className="text-blue-500 font-medium">IMO</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {userAdsStore.isLocked(ad) ? (
                                                    <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full whitespace-nowrap" title={`Locked until ${new Date(ad.editLockedUntil!).toLocaleDateString()}`}>
                                                        🔒 {AD_LIMITS.EDIT_LOCK_DAYS}d lock
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => startEdit(ad)}
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => deleteAd(ad.id)}
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                                {userAdsStore.isExpired(ad) && (
                                                    <span className="text-[10px] text-destructive bg-destructive/10 px-2 py-1 rounded-full whitespace-nowrap">Expired</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Ad space – bottom of profile */}
            <AdSpace slotKey="profile-bottom" className="mt-8 flex justify-center" />
        </div>
    );
};

export default ProfilePage;
