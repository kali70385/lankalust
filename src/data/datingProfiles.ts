// ─── Dating Profile Types ───────────────────────────────────────────
export type Gender = "Man" | "Woman" | "Couple";
export type Seeking = "Woman" | "Man" | "Couple";
export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed" | "Separated" | "It's Complicated" | "Prefer not to say";
export type SexualOrientation = "Straight" | "Gay" | "Lesbian" | "Bisexual" | "Other" | "Prefer not to say";

export interface DatingProfile {
  id: string;
  username: string;
  password?: string; // only stored, never exposed publicly
  name: string;
  age: number;
  gender: Gender;
  seeking: Seeking;
  country: string;
  district: string;
  aboutMe: string;
  interests: string;
  maritalStatus: MaritalStatus;
  sexualOrientation: SexualOrientation;
  profilePhoto: string; // URL or empty for placeholder
  createdAt: string; // ISO date string
  lastActive: string; // ISO date string
}

// ─── localStorage Keys ──────────────────────────────────────────────
const DATING_USERS_KEY = "lankalust_dating_users";
const DATING_SESSION_KEY = "lankalust_dating_session";

// ─── Helpers ────────────────────────────────────────────────────────
function randomLastActive(minMinutes: number, maxMinutes: number): string {
  const now = new Date();
  const minutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  return new Date(now.getTime() - minutes * 60000).toISOString();
}

function randomCreatedAt(minDays: number, maxDays: number): string {
  const now = new Date();
  const days = Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
  return new Date(now.getTime() - days * 86400000).toISOString();
}

// ─── Mock Profiles (seed data) ──────────────────────────────────────
export const mockDatingProfiles: DatingProfile[] = [
  { id: "m1", username: "sachini_c", name: "Sachini", age: 26, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Colombo", aboutMe: "Love travelling & meeting new people. Looking for genuine connections.", interests: "Travel, Photography, Music", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(30, 180), lastActive: randomLastActive(1, 10) },
  { id: "m2", username: "kasun_k", name: "Kasun", age: 29, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Kandy", aboutMe: "Looking for fun conversations and maybe something more.", interests: "Gym, Movies, Cars", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(30, 180), lastActive: randomLastActive(1, 5) },
  { id: "m3", username: "nimali_g", name: "Nimali", age: 24, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Galle", aboutMe: "Beach lover & free spirit. Let's explore together!", interests: "Beach, Reading, Yoga", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(10, 90), lastActive: randomLastActive(5, 30) },
  { id: "m4", username: "dilan_n", name: "Dilan", age: 31, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Gampaha", aboutMe: "Adventurous and open-minded. Life is too short to be boring.", interests: "Hiking, Cooking, Tech", maritalStatus: "Divorced", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(60, 200), lastActive: randomLastActive(10, 60) },
  { id: "m5", username: "ishara_co", name: "Ishara", age: 27, gender: "Man", seeking: "Man", country: "Sri Lanka", district: "Colombo", aboutMe: "Music, food and good vibes. Proud and open.", interests: "Music, Food, Dancing", maritalStatus: "Single", sexualOrientation: "Gay", profilePhoto: "", createdAt: randomCreatedAt(5, 60), lastActive: randomLastActive(1, 15) },
  { id: "m6", username: "chathu_m", name: "Chathurika", age: 25, gender: "Woman", seeking: "Woman", country: "Sri Lanka", district: "Matara", aboutMe: "Let's see where this goes. Open-minded and friendly.", interests: "Art, Nature, Coffee", maritalStatus: "Single", sexualOrientation: "Lesbian", profilePhoto: "", createdAt: randomCreatedAt(15, 120), lastActive: randomLastActive(2, 20) },
  { id: "m7", username: "nuwan_r", name: "Nuwan", age: 33, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Kurunegala", aboutMe: "Simple guy looking for a real connection. No games.", interests: "Cricket, Movies, Travel", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(30, 150), lastActive: randomLastActive(15, 120) },
  { id: "m8", username: "malini_j", name: "Malini", age: 28, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Jaffna", aboutMe: "Looking for someone who values honesty and humor.", interests: "Cooking, Reading, Dancing", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(20, 100), lastActive: randomLastActive(3, 45) },
  { id: "m9", username: "saman_b", name: "Saman", age: 34, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Badulla", aboutMe: "Mature, respectful, and adventurous. Love the hills.", interests: "Hiking, Tea, Photography", maritalStatus: "Married", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(60, 250), lastActive: randomLastActive(20, 200) },
  { id: "m10", username: "tharushi_p", name: "Tharushi", age: 23, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Colombo", aboutMe: "Young, fun and ready to mingle. DM me!", interests: "Fashion, Social Media, Music", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(3, 30), lastActive: randomLastActive(1, 8) },
  { id: "m11", username: "pradeep_a", name: "Pradeep", age: 30, gender: "Man", seeking: "Man", country: "Sri Lanka", district: "Colombo", aboutMe: "Life's an adventure. Looking for a partner in crime.", interests: "Fitness, Travel, Cooking", maritalStatus: "Single", sexualOrientation: "Gay", profilePhoto: "", createdAt: randomCreatedAt(20, 100), lastActive: randomLastActive(5, 40) },
  { id: "m12", username: "dilani_h", name: "Dilani", age: 30, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Kalutara", aboutMe: "Teacher by day, dreamer by night. Looking for real love.", interests: "Books, Nature, Movies", maritalStatus: "Divorced", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(40, 180), lastActive: randomLastActive(8, 60) },
  { id: "m13", username: "ravindu_w", name: "Ravindu", age: 26, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Ratnapura", aboutMe: "Gem city boy with a golden heart.", interests: "Gems, Business, Cars", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(10, 70), lastActive: randomLastActive(2, 25) },
  { id: "m14", username: "sanduni_t", name: "Sanduni", age: 26, gender: "Woman", seeking: "Woman", country: "Sri Lanka", district: "Gampaha", aboutMe: "Quiet soul with a loud laugh. Looking for my person.", interests: "Poetry, Art, Movies", maritalStatus: "Single", sexualOrientation: "Lesbian", profilePhoto: "", createdAt: randomCreatedAt(10, 80), lastActive: randomLastActive(3, 30) },
  { id: "m15", username: "couple_cn", name: "Chamara & Nilmini", age: 33, gender: "Couple", seeking: "Couple", country: "Sri Lanka", district: "Colombo", aboutMe: "Fun couple looking to meet like-minded people.", interests: "Travel, Dining, Socializing", maritalStatus: "Married", sexualOrientation: "Bisexual", profilePhoto: "", createdAt: randomCreatedAt(30, 120), lastActive: randomLastActive(10, 50) },
  { id: "m16", username: "amal_col", name: "Amal", age: 28, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Colombo", aboutMe: "Software engineer who loves good coffee and better company.", interests: "Tech, Coffee, Gaming", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(5, 40), lastActive: randomLastActive(1, 12) },
  { id: "m17", username: "hiruni_m", name: "Hiruni", age: 27, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Matale", aboutMe: "Christmas baby! Sweet but spicy. Let's talk.", interests: "Cooking, Movies, Dancing", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(15, 90), lastActive: randomLastActive(4, 35) },
  { id: "m18", username: "janith_anp", name: "Janith", age: 31, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Anuradhapura", aboutMe: "History lover from the ancient city. Old school romantic.", interests: "History, Photography, Cycling", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(40, 200), lastActive: randomLastActive(30, 180) },
  { id: "m19", username: "nethmi_k", name: "Nethmi", age: 24, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Kandy", aboutMe: "Hill country girl with city dreams. Let's vibe!", interests: "Music, Fashion, Travel", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(7, 50), lastActive: randomLastActive(1, 20) },
  { id: "m20", username: "couple_rk", name: "Ruwan & Kumari", age: 35, gender: "Couple", seeking: "Woman", country: "Sri Lanka", district: "Galle", aboutMe: "Open-minded couple from the south. Friendly and discreet.", interests: "Beach, Wine, Music", maritalStatus: "Married", sexualOrientation: "Bisexual", profilePhoto: "", createdAt: randomCreatedAt(60, 300), lastActive: randomLastActive(5, 45) },
  { id: "m21", username: "thilina_p", name: "Thilina", age: 29, gender: "Man", seeking: "Woman", country: "Sri Lanka", district: "Polonnaruwa", aboutMe: "Country boy looking for love.", interests: "Farming, Nature, Music", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(20, 130), lastActive: randomLastActive(10, 80) },
  { id: "m22", username: "kavisha_t", name: "Kavisha", age: 27, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Trincomalee", aboutMe: "Born on Valentine's Day! Romantic by nature.", interests: "Sunset Walks, Cooking, Poetry", maritalStatus: "Single", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(10, 60), lastActive: randomLastActive(2, 18) },
  { id: "m23", username: "harsha_b", name: "Harsha", age: 32, gender: "Man", seeking: "Man", country: "Sri Lanka", district: "Kandy", aboutMe: "Professional, discreet, genuine. Quality over quantity.", interests: "Travel, Wine, Fitness", maritalStatus: "Single", sexualOrientation: "Gay", profilePhoto: "", createdAt: randomCreatedAt(30, 150), lastActive: randomLastActive(8, 55) },
  { id: "m24", username: "nadeeka_h", name: "Nadeeka", age: 30, gender: "Woman", seeking: "Man", country: "Sri Lanka", district: "Hambantota", aboutMe: "Southern beauty with a heart of gold.", interests: "Animals, Nature, Cooking", maritalStatus: "Widowed", sexualOrientation: "Straight", profilePhoto: "", createdAt: randomCreatedAt(50, 200), lastActive: randomLastActive(15, 100) },
];

// ─── Storage helpers ────────────────────────────────────────────────
export function getDatingUsers(): DatingProfile[] {
  try {
    const stored = localStorage.getItem(DATING_USERS_KEY);
    if (!stored) {
      // Seed with mock profiles
      localStorage.setItem(DATING_USERS_KEY, JSON.stringify(mockDatingProfiles));
      return [...mockDatingProfiles];
    }
    return JSON.parse(stored);
  } catch {
    return [...mockDatingProfiles];
  }
}

export function saveDatingUsers(users: DatingProfile[]) {
  localStorage.setItem(DATING_USERS_KEY, JSON.stringify(users));
}

export function getDatingSession(): DatingProfile | null {
  try {
    const session = localStorage.getItem(DATING_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export function saveDatingSession(profile: DatingProfile | null) {
  if (profile) {
    localStorage.setItem(DATING_SESSION_KEY, JSON.stringify(profile));
  } else {
    localStorage.removeItem(DATING_SESSION_KEY);
  }
}

export function getAllPublicProfiles(): DatingProfile[] {
  const users = getDatingUsers();
  // Strip passwords before exposing
  return users.map(({ password, ...rest }) => ({ ...rest, password: undefined }));
}

export function getProfileById(id: string): DatingProfile | undefined {
  const users = getDatingUsers();
  const user = users.find(u => u.id === id);
  if (user) {
    const { password, ...publicProfile } = user;
    return { ...publicProfile, password: undefined };
  }
  return undefined;
}

export function updateUserLastActive(userId: string) {
  const users = getDatingUsers();
  const idx = users.findIndex(u => u.id === userId);
  if (idx >= 0) {
    users[idx].lastActive = new Date().toISOString();
    saveDatingUsers(users);
  }
}

export function formatLastActive(lastActive: string): string {
  const now = new Date();
  const last = new Date(lastActive);
  const diffMs = now.getTime() - last.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSec < 60) return `Active ${diffSec}s ago`;
  if (diffMin < 60) return `Active ${diffMin}m ago`;
  if (diffHrs < 24) return `Active ${diffHrs}h ago`;
  if (diffDays < 7) return `Active ${diffDays}d ago`;
  return `Active ${Math.floor(diffDays / 7)}w ago`;
}

