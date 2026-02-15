import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Heart, MapPin, ArrowLeft, Clock, User, Search, Mail, Send, AlertCircle } from "lucide-react";
import { AdSpace } from "@/components/AdSpace";
import { useDatingAuth } from "@/contexts/DatingAuthContext";
import { getProfileById, formatLastActive, type DatingProfile } from "@/data/datingProfiles";
import { sendMessage } from "@/data/datingMessages";

const DatingMemberPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDatingLoggedIn, datingUser, setShowDatingAuthModal } = useDatingAuth();
  const [profile, setProfile] = useState<DatingProfile | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Message form state
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgSent, setMsgSent] = useState(false);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    if (id) {
      const p = getProfileById(id);
      if (p) {
        setProfile(p);
      } else {
        setNotFound(true);
      }
    }
  }, [id]);

  if (notFound) {
    return (
      <div className="container py-16 text-center">
        <User className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="text-xl font-display font-bold text-foreground mb-2">Member Not Found</h2>
        <p className="text-muted-foreground mb-6">This profile doesn't exist or has been removed.</p>
        <Button variant="hero" onClick={() => navigate("/dating")} className="gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Dating
        </Button>
      </div>
    );
  }

  if (!profile) return null;

  const isOnline = (new Date().getTime() - new Date(profile.lastActive).getTime()) < 600000;
  const isOwnProfile = datingUser?.id === profile.id;

  const handleSendMessage = () => {
    setMsgError("");
    if (!datingUser || !profile) return;
    if (!msgBody.trim()) {
      setMsgError("Please write a message.");
      return;
    }
    sendMessage({
      fromUserId: datingUser.id,
      fromUsername: datingUser.username,
      fromName: datingUser.name,
      fromPhoto: datingUser.profilePhoto || "",
      toUserId: profile.id,
      toUsername: profile.username,
      toName: profile.name,
      toPhoto: profile.profilePhoto || "",
      subject: msgSubject.trim() || "Hello!",
      body: msgBody.trim(),
    });
    setMsgSubject("");
    setMsgBody("");
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 4000);
    setShowMessageForm(false);
  };

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
        <div className="relative h-40 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
          {profile.profilePhoto ? (
            <img
              src={profile.profilePhoto}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-card"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-display font-bold text-primary border-4 border-card">
              {profile.name[0]}
            </div>
          )}
          {/* Online indicator */}
          {isOnline && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500/20 text-green-500 text-xs font-medium px-2.5 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Online
            </div>
          )}
        </div>

        {/* Ad space – below profile image */}
        <AdSpace slotKey="detail-below-image" className="flex justify-center py-2" />

        <div className="p-6">
          {/* Name & basic info */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground">{profile.name}, {profile.age}</h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
              <span className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5" /> {profile.district.replace("_", " ")}, {profile.country}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                <User className="w-3.5 h-3.5" /> {profile.gender}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                <Search className="w-3.5 h-3.5" /> Seeking {profile.seeking}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                Age {profile.age}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" /> {formatLastActive(profile.lastActive)}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-5">
            {/* About Me */}
            {profile.aboutMe && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">About Me</h3>
                <p className="text-sm text-secondary-foreground bg-secondary/50 rounded-lg p-3">{profile.aboutMe}</p>
              </div>
            )}

            {/* Interests */}
            {profile.interests && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.split(",").map((interest, i) => (
                    <span key={i} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional details */}
            <div className="grid grid-cols-2 gap-4">
              {profile.maritalStatus && profile.maritalStatus !== "Prefer not to say" && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Marital Status</h3>
                  <p className="text-sm text-foreground">{profile.maritalStatus}</p>
                </div>
              )}
              {profile.sexualOrientation && profile.sexualOrientation !== "Prefer not to say" && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Orientation</h3>
                  <p className="text-sm text-foreground">{profile.sexualOrientation}</p>
                </div>
              )}
            </div>

            {/* Send Message Section */}
            {!isOwnProfile && (
              <div className="border-t border-border pt-5">
                {msgSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg px-3 py-2.5 mb-4 text-sm"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    Message sent to {profile.name}!
                  </motion.div>
                )}

                {!showMessageForm ? (
                  <Button
                    variant="hero"
                    className="w-full gap-2"
                    onClick={() => {
                      if (!isDatingLoggedIn) {
                        setShowDatingAuthModal(true);
                        return;
                      }
                      setShowMessageForm(true);
                    }}
                  >
                    <Mail className="w-4 h-4" /> Send Private Message
                  </Button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> Send a message to {profile.name}
                    </h3>

                    {msgError && (
                      <div className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-3 py-2 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {msgError}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label className="text-xs">Subject <span className="text-muted-foreground">(optional)</span></Label>
                      <Input
                        className="bg-secondary border-border"
                        placeholder="Hello!"
                        value={msgSubject}
                        onChange={(e) => setMsgSubject(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Message *</Label>
                      <Textarea
                        className="bg-secondary border-border min-h-[80px]"
                        placeholder="Write your message..."
                        value={msgBody}
                        onChange={(e) => setMsgBody(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="hero"
                        size="sm"
                        className="gap-1.5"
                        onClick={handleSendMessage}
                      >
                        <Send className="w-4 h-4" /> Send
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setShowMessageForm(false); setMsgError(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Member since */}
            <div className="border-t border-border pt-4 text-xs text-muted-foreground">
              Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>

            {/* Ad space – dating profile bottom */}
            <AdSpace slotKey="dating-profile-bottom" className="mt-4 flex justify-center" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DatingMemberPage;
