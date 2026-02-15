import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type DatingProfile,
  type Gender,
  type Seeking,
  type MaritalStatus,
  type SexualOrientation,
  getDatingUsers,
  saveDatingUsers,
  getDatingSession,
  saveDatingSession,
  updateUserLastActive,
} from "@/data/datingProfiles";

// ─── Context types ──────────────────────────────────────────────────
export interface DatingRegisterFields {
  username: string;
  password: string;
  name: string;
  age: number;
  gender: Gender;
  seeking: Seeking;
  country: string;
  district: string;
}

interface DatingAuthContextType {
  datingUser: DatingProfile | null;
  isDatingLoggedIn: boolean;
  datingLogin: (username: string, password: string) => { success: boolean; error?: string };
  datingRegister: (fields: DatingRegisterFields) => { success: boolean; error?: string };
  datingLogout: () => void;
  updateDatingProfile: (fields: Partial<DatingProfile>) => { success: boolean; error?: string };
  showDatingAuthModal: boolean;
  setShowDatingAuthModal: (v: boolean) => void;
}

const DatingAuthContext = createContext<DatingAuthContextType | null>(null);

export const useDatingAuth = () => {
  const ctx = useContext(DatingAuthContext);
  if (!ctx) throw new Error("useDatingAuth must be used within DatingAuthProvider");
  return ctx;
};

// ─── Provider ───────────────────────────────────────────────────────
export const DatingAuthProvider = ({ children }: { children: ReactNode }) => {
  const [datingUser, setDatingUser] = useState<DatingProfile | null>(null);
  const [showDatingAuthModal, setShowDatingAuthModal] = useState(false);

  // Restore session
  useEffect(() => {
    const session = getDatingSession();
    if (session) {
      setDatingUser(session);
      updateUserLastActive(session.id);
    }
  }, []);

  // Keep lastActive updated every 60s while logged in
  useEffect(() => {
    if (!datingUser) return;
    const interval = setInterval(() => {
      updateUserLastActive(datingUser.id);
    }, 60000);
    return () => clearInterval(interval);
  }, [datingUser]);

  const datingLogin = useCallback((username: string, password: string) => {
    const users = getDatingUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
    );
    if (!found) {
      return { success: false, error: "Invalid username or password." };
    }
    found.lastActive = new Date().toISOString();
    saveDatingUsers(users);
    const { password: _, ...sessionUser } = found;
    setDatingUser(sessionUser as DatingProfile);
    saveDatingSession(sessionUser as DatingProfile);
    return { success: true };
  }, []);

  const datingRegister = useCallback((fields: DatingRegisterFields) => {
    const users = getDatingUsers();
    const exists = users.find((u) => u.username.toLowerCase() === fields.username.toLowerCase());
    if (exists) {
      return { success: false, error: "Username already taken." };
    }
    if (!fields.username || !fields.password || !fields.name || !fields.age || !fields.gender || !fields.seeking || !fields.district) {
      return { success: false, error: "Please fill in all required fields." };
    }

    if (fields.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    if (fields.age < 18) {
      return { success: false, error: "You must be at least 18 years old to register." };
    }
    if (fields.age > 99) {
      return { success: false, error: "Please enter a valid age." };
    }

    const now = new Date().toISOString();
    const newProfile: DatingProfile = {
      id: `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      username: fields.username,
      password: fields.password,
      name: fields.name,
      age: fields.age,
      gender: fields.gender,
      seeking: fields.seeking,
      country: fields.country || "Sri Lanka",
      district: fields.district,
      aboutMe: "",
      interests: "",
      maritalStatus: "Single",
      sexualOrientation: "Prefer not to say",
      profilePhoto: "",
      createdAt: now,
      lastActive: now,
    };

    saveDatingUsers([...users, newProfile]);
    const { password: _, ...sessionUser } = newProfile;
    setDatingUser(sessionUser as DatingProfile);
    saveDatingSession(sessionUser as DatingProfile);
    return { success: true };
  }, []);

  const datingLogout = useCallback(() => {
    if (datingUser) {
      updateUserLastActive(datingUser.id);
    }
    setDatingUser(null);
    saveDatingSession(null);
  }, [datingUser]);

  const updateDatingProfile = useCallback((fields: Partial<DatingProfile>) => {
    if (!datingUser) return { success: false, error: "Not logged in." };
    const users = getDatingUsers();
    const idx = users.findIndex((u) => u.id === datingUser.id);
    if (idx < 0) return { success: false, error: "Profile not found." };

    const updated = { ...users[idx], ...fields, lastActive: new Date().toISOString() };
    users[idx] = updated;
    saveDatingUsers(users);
    const { password: _, ...sessionUser } = updated;
    setDatingUser(sessionUser as DatingProfile);
    saveDatingSession(sessionUser as DatingProfile);
    return { success: true };
  }, [datingUser]);

  return (
    <DatingAuthContext.Provider
      value={{
        datingUser,
        isDatingLoggedIn: !!datingUser,
        datingLogin,
        datingRegister,
        datingLogout,
        updateDatingProfile,
        showDatingAuthModal,
        setShowDatingAuthModal,
      }}
    >
      {children}
    </DatingAuthContext.Provider>
  );
};
