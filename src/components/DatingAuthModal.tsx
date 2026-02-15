import { useState } from "react";
import { useDatingAuth } from "@/contexts/DatingAuthContext";
import type { Gender, Seeking } from "@/data/datingProfiles";
import { districts } from "@/data/locations";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Lock, Heart, AlertCircle, MapPin } from "lucide-react";

const genderOptions: Gender[] = ["Man", "Woman", "Couple"];
const seekingOptions: Seeking[] = ["Woman", "Man", "Couple"];
const districtNames = Object.keys(districts);

const DatingAuthModal = () => {
  const { showDatingAuthModal, setShowDatingAuthModal, datingLogin, datingRegister } = useDatingAuth();
  const [tab, setTab] = useState<"login" | "register">("register");
  const [error, setError] = useState("");

  // Login fields
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register fields
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regGender, setRegGender] = useState<Gender | "">("");
  const [regSeeking, setRegSeeking] = useState<Seeking | "">("");
  const [regDistrict, setRegDistrict] = useState("");

  const resetFields = () => {
    setLoginUsername(""); setLoginPassword("");
    setRegUsername(""); setRegPassword(""); setRegConfirmPassword("");
    setRegName(""); setRegAge(""); setRegGender(""); setRegSeeking(""); setRegDistrict("");
    setError("");
  };

  const switchTab = (t: "login" | "register") => {
    setTab(t);
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginUsername.trim() || !loginPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    const result = datingLogin(loginUsername.trim(), loginPassword);
    if (result.success) {
      resetFields();
      setShowDatingAuthModal(false);
    } else {
      setError(result.error || "Login failed.");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!regUsername.trim() || !regPassword.trim() || !regConfirmPassword.trim() || !regName.trim() || !regAge || !regGender || !regSeeking || !regDistrict) {
      setError("Please fill in all required fields.");
      return;
    }
    if (regUsername.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = datingRegister({
      username: regUsername.trim(),
      password: regPassword,
      name: regName.trim(),
      age: parseInt(regAge),
      gender: regGender as Gender,
      seeking: regSeeking as Seeking,
      country: "Sri Lanka",
      district: regDistrict,
    });
    if (result.success) {
      resetFields();
      setShowDatingAuthModal(false);
    } else {
      setError(result.error || "Registration failed.");
    }
  };

  return (
    <Dialog
      open={showDatingAuthModal}
      onOpenChange={(open) => {
        setShowDatingAuthModal(open);
        if (!open) resetFields();
      }}
    >
      <DialogContent className="sm:max-w-[480px] bg-card border-border p-0 gap-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Tab headers */}
        <div className="flex border-b border-border sticky top-0 bg-card z-10">
          <button
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "login"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => switchTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === "register"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => switchTab("register")}
          >
            Join Dating
          </button>
        </div>

        <div className="p-6">
          <DialogHeader className="mb-5">
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {tab === "login" ? "Welcome Back" : "Create Dating Profile"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {tab === "login"
                ? "Sign in to your dating account"
                : "Fill in your details to start meeting people"}
            </p>
          </DialogHeader>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg px-3 py-2.5 mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dating-login-username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dating-login-username"
                    placeholder="Enter your username"
                    className="pl-10 bg-secondary border-border"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dating-login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dating-login-password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10 bg-secondary border-border"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg">
                Login
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don't have a dating account?{" "}
                <button type="button" className="text-primary font-medium hover:underline" onClick={() => switchTab("register")}>
                  Join now
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="dating-reg-username">Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dating-reg-username"
                    placeholder="Choose a username"
                    className="pl-10 bg-secondary border-border"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="dating-reg-name">Display Name *</Label>
                <Input
                  id="dating-reg-name"
                  placeholder="Your public name"
                  className="bg-secondary border-border"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="dating-reg-age">Age *</Label>
                <Input
                  id="dating-reg-age"
                  type="number"
                  placeholder="Your age (18+)"
                  className="bg-secondary border-border"
                  value={regAge}
                  min={18}
                  max={99}
                  onChange={(e) => setRegAge(e.target.value)}
                />
              </div>

              {/* Gender & Seeking - side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>I am a *</Label>
                  <Select value={regGender} onValueChange={(v) => setRegGender(v as Gender)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Looking for a *</Label>
                  <Select value={regSeeking} onValueChange={(v) => setRegSeeking(v as Seeking)}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {seekingOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label>District *</Label>
                <div className="relative">
                  <Select value={regDistrict} onValueChange={setRegDistrict}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select your district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtNames.map((d) => (
                        <SelectItem key={d} value={d}>{d.replace("_", " ")}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="dating-reg-password">Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dating-reg-password"
                    type="password"
                    placeholder="At least 6 characters"
                    className="pl-10 bg-secondary border-border"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dating-reg-confirm">Confirm Password *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dating-reg-confirm"
                    type="password"
                    placeholder="Re-enter password"
                    className="pl-10 bg-secondary border-border"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg">
                Create Dating Profile
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have a dating account?{" "}
                <button type="button" className="text-primary font-medium hover:underline" onClick={() => switchTab("login")}>
                  Login here
                </button>
              </p>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DatingAuthModal;
