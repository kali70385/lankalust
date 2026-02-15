export const categoryTabs = [
  "All", "Male Personals", "Female Personals", "Massage", "Live Cam", "Toys", "Jobs", "Hotel/Rooms", "Other"
];

const titles = [
  "Looking for genuine connection", "Professional massage service", "Luxury hotel room available",
  "Fun and friendly personality", "Discreet encounters only", "Weekend companion wanted",
  "VIP escort service", "Couple looking for friends", "Relaxation massage therapy",
  "Adventure partner needed", "Premium cam show", "Adult toys collection sale",
  "Part-time model needed", "Cozy room for rent hourly", "Sensual massage expert",
  "New in town - let's meet", "Experienced and mature", "Young and energetic",
  "Romantic dinner date", "Travel companion wanted", "Night shift available",
  "Special weekend offer", "First time here", "Trustworthy and verified",
];

const descriptions = [
  "Genuine person looking for a real connection. Serious inquiries only please.",
  "Professional and experienced. Clean and comfortable environment guaranteed.",
  "Fully furnished luxury room available for short-term stays. AC, WiFi included.",
  "Easy-going personality, love to have fun. Available weekdays and weekends.",
  "Privacy is my top priority. Looking for like-minded individuals only.",
  "Available for outings, events, and casual meetups. No drama please.",
  "Premium service with complete satisfaction guaranteed. Contact for details.",
  "Friendly couple exploring new experiences together. Respectful people only.",
  "Certified therapist offering relaxing full body massage treatments.",
  "Love traveling and exploring. Looking for someone to share adventures with.",
  "High quality streaming with interactive features. Subscribe now.",
  "Brand new imported items at discounted prices. Discreet packaging available.",
];

const districts = ["Colombo", "Gampaha", "Kandy", "Galle", "Matara", "Jaffna", "Kurunegala", "Negombo", "Ratnapura", "Badulla"];
const cities = ["Colombo 3", "Negombo", "Kandy City", "Galle City", "Hikkaduwa", "Jaffna City", "Dehiwala", "Mount Lavinia", "Nugegoda", "Ella"];

export const mockAds = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: titles[i % titles.length],
  description: descriptions[i % descriptions.length],
  category: categoryTabs[1 + (i % 8)],
  district: districts[i % districts.length],
  city: cities[i % cities.length],
  location: `${cities[i % cities.length]}, ${districts[i % districts.length]}`,
  time: `${(i % 12) + 1}h ago`,
  verified: i % 3 === 0,
  image: `https://picsum.photos/seed/ad${i + 1}/300/200`,
}));
