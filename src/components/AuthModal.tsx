import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Phone, Lock, AlertCircle } from "lucide-react";

/**
 * Validates a Sri Lankan phone number.
 * Accepted formats:
 *   07XXXXXXXX  (10 digits, starts with 07)
 *   +947XXXXXXXX  (12 digits with +94 prefix)
 *   947XXXXXXXX   (11 digits with 94 prefix)
 */
const validateSLPhone = (phone: string): { valid: boolean; error?: string } => {
    const cleaned = phone.replace(/[\s\-()]/g, "");

    // Format: 07XXXXXXXX
    if (/^07[0-9]{8}$/.test(cleaned)) return { valid: true };

    // Format: +947XXXXXXXX
    if (/^\+947[0-9]{8}$/.test(cleaned)) return { valid: true };

    // Format: 947XXXXXXXX
    if (/^947[0-9]{8}$/.test(cleaned)) return { valid: true };

    return {
        valid: false,
        error: "Enter a valid Sri Lankan number (e.g. 0771234567 or +94771234567)",
    };
};

const AuthModal = () => {
    const { showAuthModal, setShowAuthModal, login, register } = useAuth();
    const [tab, setTab] = useState<"login" | "register">("login");
    const [error, setError] = useState("");

    // Login fields
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register fields
    const [regUsername, setRegUsername] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regConfirmPassword, setRegConfirmPassword] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const resetFields = () => {
        setLoginUsername("");
        setLoginPassword("");
        setRegUsername("");
        setRegPhone("");
        setRegPassword("");
        setRegConfirmPassword("");
        setError("");
        setPhoneError("");
    };

    const switchTab = (t: "login" | "register") => {
        setTab(t);
        setError("");
        setPhoneError("");
    };

    const handlePhoneChange = (value: string) => {
        setRegPhone(value);
        if (value.length > 0) {
            const { valid, error } = validateSLPhone(value);
            setPhoneError(valid ? "" : error || "");
        } else {
            setPhoneError("");
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!loginUsername.trim() || !loginPassword.trim()) {
            setError("Please fill in all fields.");
            return;
        }
        const result = login(loginUsername.trim(), loginPassword);
        if (result.success) {
            resetFields();
            setShowAuthModal(false);
        } else {
            setError(result.error || "Login failed.");
        }
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!regUsername.trim() || !regPhone.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
            setError("Please fill in all fields.");
            return;
        }

        if (regUsername.trim().length < 3) {
            setError("Username must be at least 3 characters.");
            return;
        }

        const phoneValidation = validateSLPhone(regPhone);
        if (!phoneValidation.valid) {
            setPhoneError(phoneValidation.error || "Invalid phone number.");
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

        const cleaned = regPhone.replace(/[\s\-()]/g, "");
        const result = register(regUsername.trim(), cleaned, regPassword);
        if (result.success) {
            resetFields();
            setShowAuthModal(false);
        } else {
            setError(result.error || "Registration failed.");
        }
    };

    return (
        <Dialog
            open={showAuthModal}
            onOpenChange={(open) => {
                setShowAuthModal(open);
                if (!open) resetFields();
            }}
        >
            <DialogContent className="sm:max-w-[420px] bg-card border-border p-0 gap-0 overflow-hidden">
                {/* Tab headers */}
                <div className="flex border-b border-border">
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
                        Register
                    </button>
                </div>

                <div className="p-6">
                    <DialogHeader className="mb-5">
                        <DialogTitle className="text-xl font-display">
                            {tab === "login" ? "Welcome Back" : "Create Account"}
                        </DialogTitle>
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
                                <Label htmlFor="login-username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="login-username"
                                        placeholder="Enter your username"
                                        className="pl-10 bg-secondary border-border"
                                        value={loginUsername}
                                        onChange={(e) => setLoginUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="login-password"
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
                                Don't have an account?{" "}
                                <button type="button" className="text-primary font-medium hover:underline" onClick={() => switchTab("register")}>
                                    Register here
                                </button>
                            </p>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reg-username">Username</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-username"
                                        placeholder="Choose a username"
                                        className="pl-10 bg-secondary border-border"
                                        value={regUsername}
                                        onChange={(e) => setRegUsername(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg-phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-phone"
                                        placeholder="07XXXXXXXX or +947XXXXXXXX"
                                        className={`pl-10 bg-secondary border-border ${phoneError ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                        value={regPhone}
                                        onChange={(e) => handlePhoneChange(e.target.value)}
                                    />
                                </div>
                                {phoneError && (
                                    <p className="text-xs text-destructive flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> {phoneError}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg-password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-password"
                                        type="password"
                                        placeholder="At least 6 characters"
                                        className="pl-10 bg-secondary border-border"
                                        value={regPassword}
                                        onChange={(e) => setRegPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reg-confirm">Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="reg-confirm"
                                        type="password"
                                        placeholder="Re-enter password"
                                        className="pl-10 bg-secondary border-border"
                                        value={regConfirmPassword}
                                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button type="submit" variant="hero" className="w-full" size="lg">
                                Create Account
                            </Button>

                            <p className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
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

export default AuthModal;
