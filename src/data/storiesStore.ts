// ─── WalKatha Types ────────────────────────────────────────────────
export interface Story {
  id: number;
  title: string;
  author: string;
  views: number;
  likes: number;
  time: string;
  excerpt: string;
  image?: string;
  content: string;
  category: string;
  createdTs: number; // unix ms for sorting
}

// ─── Category list ─────────────────────────────────────────────────
export const walkathaCategories = [
  { name: "BDSM", slug: "bdsm" },
  { name: "Cuckold", slug: "cuckold" },
  { name: "Gay", slug: "gay" },
  { name: "Hot Wife", slug: "hot-wife" },
  { name: "Lesbian", slug: "lesbian" },
  { name: "Massage", slug: "massage" },
  { name: "Other", slug: "other" },
  { name: "Taboo", slug: "taboo" },
  { name: "Teacher", slug: "teacher" },
  { name: "Threesome", slug: "threesome" },
];

// ─── Mock / seed data ──────────────────────────────────────────────
export const mockStories: Story[] = [
  {
    id: 1,
    title: "රහස් හමුව",
    author: "Anonymous",
    views: 1245,
    likes: 89,
    time: "2h ago",
    excerpt: "එදා රාත්‍රියේ අපි හමුවුණා...",
    category: "taboo",
    createdTs: Date.now() - 2 * 60 * 60 * 1000,
    content:
      "එදා රාත්‍රියේ අපි හමුවුණා. සඳ එළිය පතිත වුණු ඒ මාවත දිගේ ඇවිද ගියා. කවුරුත් නැති ඒ මාවතේ අපි දෙන්නා විතරයි. හදවත් දෙකක් එකට ගැහුණා. ඔබේ ඇස් දෙකේ දිලිසුම සඳ එළියට වඩා ලස්සනයි කියලා මට හිතුණා. ඒ මොහොතේ මම ඔබට කිව්වා, 'මේ රාත්‍රිය අමතක කරන්න බැහැ' කියලා. ඔබ සිනාසුණා. ඒ සිනහව මට ජීවත් වෙන්න හේතුවක් දුන්නා.\n\nඅපි මුහුදු තීරයට ගියා. රැළි හඬ අපේ කථාබහට සංගීතයක් වුණා. වැලි කෙත්තේ වාඩිවෙලා, අහස දිහා බැලුවා. තරු ගැන කථා කලා. ජීවිතය ගැන කථා කලා. ආදරය ගැන කථා කලා.",
  },
  {
    id: 2,
    title: "මුහුදු තීරයේ",
    author: "KandyGirl",
    views: 982,
    likes: 67,
    time: "5h ago",
    excerpt: "මුහුදු සුළඟ හමනකොට...",
    category: "hot-wife",
    createdTs: Date.now() - 5 * 60 * 60 * 1000,
    content:
      "මුහුදු සුළඟ හමනකොට මගේ හිසකෙස් නටනවා. ඔහු මා දිහා බැලුවා. ඒ බැල්ම මට අමතක වෙන්නේ නැහැ. මුහුදු තීරයේ අපි දෙන්නා තනිවුණා.\n\nදිය රැළි අපේ පාද සේදුවා. සඳ එළිය මුහුද මත දිදුලුවා. ඔහු මගේ අත අල්ලාගත්තා. 'මට ඔයාව හම්බවුණේ මුහුදු තීරයේ, මගේ ජීවිතය වෙනස් වුණේ මේ මොහොතේ' කියලා ඔහු කිව්වා. මම දෙපා නැති වුණා වගේ දැනුණා. ආදරය මුහුදු රැළි වගේ. එනවා, ඉක්මනට පිටවෙනවා. නමුත් ඒ මතකය හැමදාකටම තියෙනවා.",
  },
  {
    id: 3,
    title: "ඔෆිස් එකේ රහස",
    author: "NightWriter",
    views: 2130,
    likes: 156,
    time: "1d ago",
    excerpt: "කාර්යාලයේ සැමදෙනා ගියා...",
    category: "teacher",
    createdTs: Date.now() - 24 * 60 * 60 * 1000,
    content:
      "කාර්යාලයේ සැමදෙනා ගියා. මම විතරයි ඉතුරු වුණේ. ලේට් නයිට් ව'ක් කරනකොට ඒ ඇවිල්ලා. 'ඇයි තනියෙන්?' කියලා ඇහුවා. මම සිනාසුණා.\n\nඅපි කෝපි බීලා, කාර්යාල කටයුතු ගැන කථා කලා. නමුත් ඇස් දෙකෙන් වෙනම කථාවක් පැවසුණා. 'අපි ලබන සතියේ එකට ලන්ච් යමුද?' කියලා ඇයි ඇහුවේ. මම කිව්වේ ඔව් කියලා. ඒ ඔව් මගේ ජීවිතය වෙනස් කලා.",
  },
  {
    id: 4,
    title: "පළමු අත්දැකීම",
    author: "Anonymous",
    views: 3420,
    likes: 234,
    time: "2d ago",
    excerpt: "මගේ ජීවිතයේ අමතක නොවන...",
    category: "massage",
    createdTs: Date.now() - 2 * 24 * 60 * 60 * 1000,
    content:
      "මගේ ජීවිතයේ අමතක නොවන මොහොතක්. පළමු වතාවට ආදරය දැනුණු දිනය. හදවතේ ගිනිමැළි පිපුණා. සුළඟ පවා නැවතුණා වගේ දැනුණා.\n\nඇය සිනාසුණා. ඒ සිනහව ලෝකයේ ලස්සනම දෙය. 'ඔයාට මම ආදරෙයි' කියලා කිව්වා. ඒ වචන මගේ හිතේ ගැඹුරින් කැටි වුණා. ජීවිතේ පළමු අත්දැකීම් හැමදාකටම විශේෂයි.",
  },
  {
    id: 5,
    title: "හොටෙල් කාමරය",
    author: "ColomboLover",
    views: 1876,
    likes: 145,
    time: "3d ago",
    excerpt: "දොර හැරුණු වෙලාවේ...",
    category: "cuckold",
    createdTs: Date.now() - 3 * 24 * 60 * 60 * 1000,
    content:
      "දොර හැරුණු වෙලාවේ ඇය ලස්සනටම ඇඳලා ඇවිත් හිටියා. හොටෙල් කාමරයේ ලස්සන විව් එකක් තිබුණා. කොළඹ නගරය දිදුලනවා.\n\nඅපි බැල්කනියේ සිටලා, නගරයේ ආලෝකය දිහා බැලුවා. 'මේ රාත්‍රිය අපේ විතරයි' කියලා ඇය කිව්වා. ඒ මොහොතේ ලෝකය නැවතුණා වගේ දැනුණා.",
  },
  {
    id: 6,
    title: "රාත්‍රී ගමන",
    author: "Anonymous",
    views: 1543,
    likes: 98,
    time: "4d ago",
    excerpt: "ඒ රාත්‍රියේ අපි...",
    category: "threesome",
    createdTs: Date.now() - 4 * 24 * 60 * 60 * 1000,
    content:
      "ඒ රාත්‍රියේ අපි කාර් එකේ ගියා. මාවත දිගේ තරු ආලෝකය විතරයි. ගමේ සීතල සුළඟ කාර් එකට ඇතුල් වුණා.\n\n'ඇයි මේ තරම් ලස්සන?' කියලා ඇහුවා. 'ඔයා ඉන්න නිසා' කියලා මම කිව්වා. ඒ රාත්‍රී ගමන අමතක නොවන ගමනක් වුණා. පාර නැතිවුණත් ආදරය තිබුණා.",
  },
];

// ─── Persistent Storage ────────────────────────────────────────────
const STORIES_KEY = "lankalust_stories";

export function getAllStories(): Story[] {
  try {
    const stored = localStorage.getItem(STORIES_KEY);
    if (!stored) {
      localStorage.setItem(STORIES_KEY, JSON.stringify(mockStories));
      return [...mockStories];
    }
    return JSON.parse(stored);
  } catch {
    return [...mockStories];
  }
}

function saveStories(stories: Story[]) {
  localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
}

export function getStoryById(id: number): Story | undefined {
  return getAllStories().find((s) => s.id === id);
}

export function addStory(story: Omit<Story, "id" | "createdTs" | "views" | "likes" | "time">): Story {
  const stories = getAllStories();
  const maxId = stories.reduce((max, s) => Math.max(max, s.id), 0);
  const newStory: Story = {
    ...story,
    id: maxId + 1,
    views: 0,
    likes: 0,
    time: "Just now",
    createdTs: Date.now(),
  };
  stories.unshift(newStory);
  saveStories(stories);
  return newStory;
}

export function updateStory(id: number, updates: Partial<Omit<Story, "id">>): boolean {
  const stories = getAllStories();
  const idx = stories.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  stories[idx] = { ...stories[idx], ...updates };
  saveStories(stories);
  return true;
}

export function deleteStory(id: number): boolean {
  const stories = getAllStories();
  const filtered = stories.filter((s) => s.id !== id);
  if (filtered.length === stories.length) return false;
  saveStories(filtered);
  return true;
}

export function resetStories(): void {
  localStorage.setItem(STORIES_KEY, JSON.stringify(mockStories));
}
