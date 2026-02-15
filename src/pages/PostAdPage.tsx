import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { userAdsStore, AD_LIMITS } from "@/data/userAdsStore";
import { districts, districtList } from "@/data/locations";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, ImagePlus, X } from "lucide-react";

/** Validate Sri Lankan phone: 07XXXXXXXX / +947XXXXXXXX / 947XXXXXXXX */
const isValidSLPhone = (phone: string) =>
  AD_LIMITS.CONTACT_REGEX.test(phone.replace(/[\s\-()]/g, ""));

const categories = [
  "Male Personals", "Female Personals", "Massage", "Live Cam", "Toys", "Jobs", "Hotel/Rooms", "Other"
];

const PostAdPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, setShowAuthModal } = useAuth();
  const { toast } = useToast();

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [contact, setContact] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState(false);
  const [viber, setViber] = useState(false);
  const [telegram, setTelegram] = useState(false);
  const [imo, setImo] = useState(false);
  const [error, setError] = useState("");

  // Get city options based on selected district
  const cityOptions = selectedDistrict && selectedDistrict !== "all"
    ? districts[selectedDistrict.replace(" ", "_")] ?? []
    : [];

  // If not logged in, show auth prompt
  if (!isLoggedIn) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-display font-bold mb-4">Please log in to post an ad</h1>
        <p className="text-muted-foreground mb-6">You need an account to post ads on LankaLust.</p>
        <Button variant="hero" size="lg" onClick={() => setShowAuthModal(true)}>
          Login / Register
        </Button>
      </div>
    );
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedCity("all");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > AD_LIMITS.IMAGE_MAX_MB * 1024 * 1024) {
      setError(`Image must be smaller than ${AD_LIMITS.IMAGE_MAX_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // ── Max active ads check ──
    if (userAdsStore.countActiveByUser(user!.username) >= AD_LIMITS.MAX_ACTIVE_PER_USER) {
      setError(`You can have a maximum of ${AD_LIMITS.MAX_ACTIVE_PER_USER} active ads. Please wait for an existing ad to expire or contact support.`);
      return;
    }

    // ── Required fields ──
    if (!category) { setError("Please select a category."); return; }
    if (!title.trim()) { setError("Title is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (!contact.trim()) { setError("Contact number is required."); return; }
    if (selectedDistrict === "all") { setError("Please select a district."); return; }
    if (!imagePreview) { setError("At least one image is required."); return; }

    // ── Title: 5–100 chars ──
    if (title.trim().length < AD_LIMITS.TITLE_MIN) { setError(`Title must be at least ${AD_LIMITS.TITLE_MIN} characters.`); return; }
    if (title.trim().length > AD_LIMITS.TITLE_MAX) { setError(`Title must be at most ${AD_LIMITS.TITLE_MAX} characters.`); return; }

    // ── Description: 20–1000 chars ──
    if (description.trim().length < AD_LIMITS.DESC_MIN) { setError(`Description must be at least ${AD_LIMITS.DESC_MIN} characters.`); return; }
    if (description.trim().length > AD_LIMITS.DESC_MAX) { setError(`Description must be at most ${AD_LIMITS.DESC_MAX} characters.`); return; }

    // ── Price: > 0, max 10,000,000 ──
    if (price.trim()) {
      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum <= 0) { setError("Price must be greater than 0."); return; }
      if (priceNum > AD_LIMITS.PRICE_MAX) { setError(`Price cannot exceed Rs. ${AD_LIMITS.PRICE_MAX.toLocaleString()}.`); return; }
    }

    // ── Contact: Sri Lankan format ──
    if (!isValidSLPhone(contact)) { setError("Enter a valid Sri Lankan number (e.g. 0771234567 or +94771234567)."); return; }

    // Map select value back to category name
    const categoryName = categories.find(
      (c) => c.toLowerCase().replace(/\s|\//g, "-") === category
    ) || category;

    const districtVal = selectedDistrict === "all" ? "All Locations" : selectedDistrict;
    const cityVal = selectedCity === "all" ? "" : selectedCity;
    const locationStr = cityVal
      ? `${cityVal}, ${districtVal}`
      : districtVal;

    userAdsStore.add({
      username: user!.username,
      category: categoryName,
      title: title.trim(),
      description: description.trim(),
      district: districtVal,
      city: cityVal,
      location: locationStr,
      contact: contact.trim(),
      image: imagePreview || undefined,
      price: price.trim() || undefined,
      whatsapp,
      viber,
      telegram,
      imo,
    });

    toast({
      title: "Ad Published! 🎉",
      description: "Your ad is now live.",
    });

    navigate("/profile");
  };

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-3xl font-display font-bold mb-6">
        <span className="text-gradient">Post an Ad</span>
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-card rounded-lg border border-border p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-3 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Category <span className="text-destructive">*</span></label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => (
                  <SelectItem key={c} value={c.toLowerCase().replace(/\s|\//g, "-")}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Title <span className="text-destructive">*</span> <span className="text-muted-foreground text-xs">({title.trim().length}/{AD_LIMITS.TITLE_MAX})</span></label>
            <Input
              placeholder={`Ad title (${AD_LIMITS.TITLE_MIN}–${AD_LIMITS.TITLE_MAX} characters)`}
              className="bg-secondary border-border"
              maxLength={AD_LIMITS.TITLE_MAX}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Price (LKR) <span className="text-muted-foreground text-xs">(optional, max Rs. {AD_LIMITS.PRICE_MAX.toLocaleString()})</span></label>
            <Input
              placeholder="e.g. 5000"
              className="bg-secondary border-border"
              type="number"
              min="1"
              max={AD_LIMITS.PRICE_MAX}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Description <span className="text-destructive">*</span> <span className="text-muted-foreground text-xs">({description.trim().length}/{AD_LIMITS.DESC_MAX})</span></label>
            <Textarea
              placeholder={`Describe your ad in detail (${AD_LIMITS.DESC_MIN}–${AD_LIMITS.DESC_MAX} characters)...`}
              className="bg-secondary border-border min-h-[120px]"
              maxLength={AD_LIMITS.DESC_MAX}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Image <span className="text-destructive">*</span> <span className="text-muted-foreground text-xs">(JPG/PNG, max {AD_LIMITS.IMAGE_MAX_MB}MB)</span></label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Ad preview"
                  className="w-full max-w-[300px] h-auto rounded-lg border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload image</span>
                <span className="text-xs text-muted-foreground mt-0.5">JPG, PNG, WebP</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Location: District + City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">District <span className="text-destructive">*</span></label>
              <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {districtList.map(d => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">City <span className="text-muted-foreground text-xs">(optional)</span></label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                disabled={selectedDistrict === "all" || cityOptions.length === 0}
              >
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder={selectedDistrict !== "all" ? "Select city" : "Select district first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cityOptions.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Contact Number <span className="text-destructive">*</span> <span className="text-muted-foreground text-xs">(Sri Lankan format)</span></label>
            <Input
              placeholder="07XXXXXXXX or +947XXXXXXXX"
              className="bg-secondary border-border"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          {/* Messaging App Availability */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2.5 block">Available on</label>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="whatsapp"
                  checked={whatsapp}
                  onCheckedChange={(checked) => setWhatsapp(checked === true)}
                  className="border-border data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor="whatsapp" className="text-sm cursor-pointer flex items-center gap-1.5">
                  <span className="text-green-500">●</span> WhatsApp
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="viber"
                  checked={viber}
                  onCheckedChange={(checked) => setViber(checked === true)}
                  className="border-border data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label htmlFor="viber" className="text-sm cursor-pointer flex items-center gap-1.5">
                  <span className="text-purple-500">●</span> Viber
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="imo"
                  checked={imo}
                  onCheckedChange={(checked) => setImo(checked === true)}
                  className="border-border data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor="imo" className="text-sm cursor-pointer flex items-center gap-1.5">
                  <span className="text-blue-500">●</span> IMO
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="telegram"
                  checked={telegram}
                  onCheckedChange={(checked) => setTelegram(checked === true)}
                  className="border-border data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                />
                <Label htmlFor="telegram" className="text-sm cursor-pointer flex items-center gap-1.5">
                  <span className="text-sky-500">●</span> Telegram
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" variant="hero" className="w-full" size="lg">
            Publish Ad
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostAdPage;
