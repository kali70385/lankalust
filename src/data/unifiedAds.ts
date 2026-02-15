// Unified ad type used across listings and detail pages

import { mockAds } from "@/data/mockAds";
import { userAdsStore, type UserAd } from "@/data/userAdsStore";

export interface UnifiedAd {
    id: string;
    title: string;
    description: string;
    category: string;
    district: string;
    city: string;
    location: string;
    time: string;
    verified: boolean;
    image: string;
    contact?: string;
    whatsapp?: boolean;
    viber?: boolean;
    telegram?: boolean;
    imo?: boolean;
    price?: string;
    username?: string;
    source: "mock" | "user";
}

/** Convert mock ads to unified format */
export const unifyMockAds = (): UnifiedAd[] =>
    mockAds.map((ad) => ({
        id: `mock_${ad.id}`,
        title: ad.title,
        description: ad.description,
        category: ad.category,
        district: ad.district,
        city: ad.city,
        location: ad.location,
        time: ad.time,
        verified: ad.verified,
        image: ad.image,
        source: "mock" as const,
    }));

/** Convert a user ad to unified format */
const unifyUserAd = (ad: UserAd): UnifiedAd => {
    const created = new Date(ad.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    let time: string;
    if (diffMin < 1) time = "Just now";
    else if (diffMin < 60) time = `${diffMin}m ago`;
    else if (diffMin < 1440) time = `${Math.floor(diffMin / 60)}h ago`;
    else time = `${Math.floor(diffMin / 1440)}d ago`;

    return {
        id: ad.id,
        title: ad.title,
        description: ad.description,
        category: ad.category,
        district: ad.district || "",
        city: ad.city || "",
        location: ad.location,
        time,
        verified: false,
        image: ad.image || "",
        contact: ad.contact,
        whatsapp: ad.whatsapp,
        viber: ad.viber,
        telegram: ad.telegram,
        imo: ad.imo,
        price: ad.price,
        username: ad.username,
        source: "user" as const,
    };
};

/** Get all ads (user ads first, then mock) */
export const getAllAds = (): UnifiedAd[] => {
    const userAds = userAdsStore.getAll().map(unifyUserAd);
    const mocks = unifyMockAds();
    return [...userAds, ...mocks];
};

/** Find a single ad by its unified ID */
export const findAdById = (id: string): UnifiedAd | null => {
    // Check user ads first
    const allUserAds = userAdsStore.getAll();
    const userAd = allUserAds.find((a) => a.id === id);
    if (userAd) return unifyUserAd(userAd);

    // Check mock ads
    if (id.startsWith("mock_")) {
        const numId = parseInt(id.replace("mock_", ""), 10);
        const mock = mockAds.find((a) => a.id === numId);
        if (mock) {
            return {
                id: `mock_${mock.id}`,
                title: mock.title,
                description: mock.description,
                category: mock.category,
                district: mock.district,
                city: mock.city,
                location: mock.location,
                time: mock.time,
                verified: mock.verified,
                image: mock.image,
                source: "mock",
            };
        }
    }

    return null;
};
