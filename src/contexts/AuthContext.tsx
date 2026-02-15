import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface User {
    username: string;
    phone: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (username: string, password: string) => { success: boolean; error?: string };
    register: (username: string, phone: string, password: string) => { success: boolean; error?: string };
    logout: () => void;
    showAuthModal: boolean;
    setShowAuthModal: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};

// Storage keys
const USERS_KEY = "lankalust_users";
const SESSION_KEY = "lankalust_session";

interface StoredUser {
    username: string;
    phone: string;
    password: string;
}

const getStoredUsers = (): StoredUser[] => {
    try {
        return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    } catch {
        return [];
    }
};

const saveUsers = (users: StoredUser[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);

    // Restore session on mount
    useEffect(() => {
        try {
            const session = localStorage.getItem(SESSION_KEY);
            if (session) {
                setUser(JSON.parse(session));
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }
    }, []);

    const login = (username: string, password: string) => {
        const users = getStoredUsers();
        const found = users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase() && u.password === password
        );
        if (!found) {
            return { success: false, error: "Invalid username or password." };
        }
        const sessionUser: User = { username: found.username, phone: found.phone };
        setUser(sessionUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return { success: true };
    };

    const register = (username: string, phone: string, password: string) => {
        const users = getStoredUsers();
        const exists = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
        if (exists) {
            return { success: false, error: "Username already taken." };
        }
        const phoneExists = users.find((u) => u.phone === phone);
        if (phoneExists) {
            return { success: false, error: "This phone number is already registered." };
        }
        const newUser: StoredUser = { username, phone, password };
        saveUsers([...users, newUser]);
        const sessionUser: User = { username, phone };
        setUser(sessionUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn: !!user,
                login,
                register,
                logout,
                showAuthModal,
                setShowAuthModal,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
