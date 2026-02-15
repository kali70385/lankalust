import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart, MapPin, Save, ArrowLeft, UserCircle, Camera, X, Mail, ChevronRight } from "lucide-react";
import { useDatingAuth } from "@/contexts/DatingAuthContext";
import { getUnreadCount } from "@/data/datingMessages";
import { districts } from "@/data/locations";
import type { Gender, Seeking, MaritalStatus, SexualOrientation } from "@/data/datingProfiles";

const genderOptions: Gender[] = ["Man", "Woman", "Couple"];
const seekingOptions: Seeking[] = ["Woman", "Man", "Couple"];
const maritalOptions: MaritalStatus[] = ["Single", "Married", "Divorced", "Widowed", "Separated", "It's Complicated", "Prefer not to say"];
const orientationOptions: SexualOrientation[] = ["Straight", "Gay", "Lesbian", "Bisexual", "Other", "Prefer not to say"];
const districtNames = Object.keys(districts);
const ABOUT_ME_MAX = 400;

const DatingProfilePage = () => {
  const navigate = useNavigate();
  const { isDatingLoggedIn, datingUser, updateDatingProfile, setShowDatingAuthModal } = useDatingAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isDatingLoggedIn) {
      setShowDatingAuthModal(true);
      navigate("/dating");
    }
  }, [isDatingLoggedIn, navigate, setShowDatingAuthModal]);

  // Form state
  const [name, setName] = useState(datingUser?.name || "");
  const [age, setAge] = useState(datingUser?.age?.toString() || "");
  const [gender, setGender] = useState<Gender>(datingUser?.gender || "Man");
  const [seeking, setSeeking] = useState<Seeking>(datingUser?.seeking || "Woman");
  const [district, setDistrict] = useState(datingUser?.district || "");
  const [aboutMe, setAboutMe] = useState(datingUser?.aboutMe || "");
  const [interests, setInterests] = useState(datingUser?.interests || "");
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>(datingUser?.maritalStatus || "Single");
  const [sexualOrientation, setSexualOrientation] = useState<SexualOrientation>(datingUser?.sexualOrientation || "Prefer not to say");
  const [profilePhoto, setProfilePhoto] = useState(datingUser?.profilePhoto || "");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (datingUser) {
      setName(datingUser.name);
      setAge(datingUser.age?.toString() || "");
      setGender(datingUser.gender);
      setSeeking(datingUser.seeking);
      setDistrict(datingUser.district);
      setAboutMe(datingUser.aboutMe || "");
      setInterests(datingUser.interests || "");
      setMaritalStatus(datingUser.maritalStatus || "Single");
      setSexualOrientation(datingUser.sexualOrientation || "Prefer not to say");
      setProfilePhoto(datingUser.profilePhoto || "");
    }
  }, [datingUser]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Resize to keep localStorage manageable
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 200;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxSize) { h = (h * maxSize) / w; w = maxSize; }
        } else {
          if (h > maxSize) { w = (w * maxSize) / h; h = maxSize; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        setProfilePhoto(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setProfilePhoto("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= ABOUT_ME_MAX) {
      setAboutMe(e.target.value);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const result = updateDatingProfile({
      name,
      age: parseInt(age) || 0,
      gender,
      seeking,
      district,
      aboutMe,
      interests,
      maritalStatus,
      sexualOrientation,
      profilePhoto,
    });
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  if (!datingUser) return null;

  return (
    <div className="container py-8 max-w-2xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/dating")} className="gap-1.5 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to Dating
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden"
      >
        {/* Profile header */}
        <div className="relative h-36 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt={datingUser.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-card"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-display font-bold text-primary border-4 border-card">
              {datingUser.name[0]}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground">{datingUser.name}</h1>
            <p className="text-sm text-muted-foreground">@{datingUser.username}</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">Age {datingUser.age}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {datingUser.district.replace("_", " ")}</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {datingUser.gender}</span>
            </div>
          </div>

          {/* Mailbox Link */}
          <Link to="/dating/mailbox">
            <div className="flex items-center justify-between bg-secondary/60 hover:bg-secondary border border-border rounded-lg px-4 py-3 mb-6 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Mail className="w-5 h-5 text-primary" />
                  {(() => {
                    const unread = getUnreadCount(datingUser.id);
                    return unread > 0 ? (
                      <span className="absolute -top-2 -right-2 w-4.5 h-4.5 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] px-1">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    ) : null;
                  })()}
                </div>
                <div>
                  <span className="text-sm font-semibold text-foreground">Mailbox</span>
                  <p className="text-xs text-muted-foreground">View your private messages</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </Link>

          <form onSubmit={handleSave} className="space-y-5">
            <h2 className="text-lg font-display font-semibold flex items-center gap-2">
              <UserCircle className="w-5 h-5 text-primary" /> Edit Profile
            </h2>

            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label>Profile Photo <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="relative shrink-0">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-display font-bold text-primary border-2 border-border">
                      {datingUser.name[0]}
                    </div>
                  )}
                </div>
                {/* Upload / Remove buttons */}
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" /> Upload Photo
                  </Button>
                  {profilePhoto && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-muted-foreground hover:text-destructive"
                      onClick={handleRemovePhoto}
                    >
                      <X className="w-4 h-4" /> Remove
                    </Button>
                  )}
                  <p className="text-[11px] text-muted-foreground">JPG, PNG or WebP. Max 2MB.</p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input className="bg-secondary border-border" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label>Age</Label>
              <Input
                type="number"
                className="bg-secondary border-border"
                placeholder="Your age (18+)"
                value={age}
                min={18}
                max={99}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            {/* Gender & Seeking */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>I am a</Label>
                <Select value={gender} onValueChange={(v) => setGender(v as Gender)}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {genderOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Looking for a</Label>
                <Select value={seeking} onValueChange={(v) => setSeeking(v as Seeking)}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {seekingOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* District */}
            <div className="space-y-2">
              <Label>District</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {districtNames.map((d) => <SelectItem key={d} value={d}>{d.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* About Me */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>About Me</Label>
                <span className={`text-xs ${aboutMe.length >= ABOUT_ME_MAX ? "text-destructive" : "text-muted-foreground"}`}>
                  {aboutMe.length}/{ABOUT_ME_MAX}
                </span>
              </div>
              <Textarea
                className="bg-secondary border-border min-h-[100px]"
                placeholder="Tell others about yourself..."
                value={aboutMe}
                maxLength={ABOUT_ME_MAX}
                onChange={handleAboutMeChange}
              />
            </div>

            {/* Interests */}
            <div className="space-y-2">
              <Label>Interests</Label>
              <Input
                className="bg-secondary border-border"
                placeholder="e.g. Travel, Music, Cooking"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>

            {/* Marital status & Orientation */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Marital Status</Label>
                <Select value={maritalStatus} onValueChange={(v) => setMaritalStatus(v as MaritalStatus)}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {maritalOptions.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Sexual Orientation</Label>
                <Select value={sexualOrientation} onValueChange={(v) => setSexualOrientation(v as SexualOrientation)}>
                  <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {orientationOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" variant="hero" className="gap-1.5">
                <Save className="w-4 h-4" /> Save Profile
              </Button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-green-500 font-medium"
                >
                  Profile saved!
                </motion.span>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default DatingProfilePage;
