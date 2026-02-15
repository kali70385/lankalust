// Manages user-posted ads in localStorage

// ─── Limits ───────────────────────────────────────────────────────
export const AD_LIMITS = {
  MAX_ACTIVE_PER_USER: 4,
  EDIT_LOCK_DAYS: 14,
  AD_LIFETIME_DAYS: 60,
  TITLE_MIN: 5,
  TITLE_MAX: 100,
  DESC_MIN: 20,
  DESC_MAX: 1000,
  PRICE_MAX: 10_000_000,
  IMAGE_MAX_MB: 5,
  CONTACT_REGEX: /^(?:0[0-9]{9}|\+94[0-9]{9}|94[0-9]{9})$/,
};

export interface UserAd {
    id: string;
    username: string;
    category: string;
    title: string;
    description: string;
    district: string;
    city: string;
    location: string;
    contact: string;
    image?: string;
    price?: string;
    whatsapp?: boolean;
    viber?: boolean;
    telegram?: boolean;
    imo?: boolean;
    createdAt: string;
    expiresAt?: string;       // ISO — ad becomes inactive after this
    editLockedUntil?: string; // ISO — edit/delete blocked until this
}

const STORE_KEY = "lankalust_user_ads";

const getAll = (): UserAd[] => {
    try {
        return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    } catch {
        return [];
    }
};

const save = (ads: UserAd[]) => {
    localStorage.setItem(STORE_KEY, JSON.stringify(ads));
};

export const userAdsStore = {
    /** Get all user-posted ads */
    getAll(): UserAd[] {
        return getAll();
    },

    /** Get all ads posted by a specific user */
    getByUser(username: string): UserAd[] {
        return getAll().filter((a) => a.username.toLowerCase() === username.toLowerCase());
    },

    /** Count active (non-expired) ads for a user */
    countActiveByUser(username: string): number {
        const now = Date.now();
        return getAll().filter(
            (a) => a.username.toLowerCase() === username.toLowerCase() &&
                   (!a.expiresAt || new Date(a.expiresAt).getTime() > now)
        ).length;
    },

    /** Check if an ad is still within the edit/delete lock period */
    isLocked(ad: UserAd): boolean {
        if (!ad.editLockedUntil) return false;
        return new Date(ad.editLockedUntil).getTime() > Date.now();
    },

    /** Check if an ad has expired */
    isExpired(ad: UserAd): boolean {
        if (!ad.expiresAt) return false;
        return new Date(ad.expiresAt).getTime() <= Date.now();
    },

    /** Add a new ad */
    add(ad: Omit<UserAd, "id" | "createdAt" | "expiresAt" | "editLockedUntil">): UserAd {
        const ads = getAll();
        const now = new Date();
        const expiresAt = new Date(now.getTime() + AD_LIMITS.AD_LIFETIME_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const editLockedUntil = new Date(now.getTime() + AD_LIMITS.EDIT_LOCK_DAYS * 24 * 60 * 60 * 1000).toISOString();
        const newAd: UserAd = {
            ...ad,
            id: `ua_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: now.toISOString(),
            expiresAt,
            editLockedUntil,
        };
        ads.push(newAd);
        save(ads);
        return newAd;
    },

    /** Update an existing ad */
    update(id: string, updates: Partial<Omit<UserAd, "id" | "username" | "createdAt">>): boolean {
        const ads = getAll();
        const idx = ads.findIndex((a) => a.id === id);
        if (idx === -1) return false;
        ads[idx] = { ...ads[idx], ...updates };
        save(ads);
        return true;
    },

    /** Delete an ad */
    delete(id: string): boolean {
        const ads = getAll();
        const filtered = ads.filter((a) => a.id !== id);
        if (filtered.length === ads.length) return false;
        save(filtered);
        return true;
    },
};
