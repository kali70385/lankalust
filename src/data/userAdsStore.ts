// Manages user-posted ads in localStorage

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

    /** Add a new ad */
    add(ad: Omit<UserAd, "id" | "createdAt">): UserAd {
        const ads = getAll();
        const newAd: UserAd = {
            ...ad,
            id: `ua_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
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
