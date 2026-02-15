import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, X } from "lucide-react";

const mockProfiles = [
  { id: 1, name: "Sachini", age: 26, location: "Colombo", bio: "Love travelling & meeting new people ✨" },
  { id: 2, name: "Kasun", age: 29, location: "Kandy", bio: "Looking for fun conversations 🔥" },
  { id: 3, name: "Nimali", age: 24, location: "Galle", bio: "Beach lover & free spirit 🌊" },
  { id: 4, name: "Dilan", age: 31, location: "Negombo", bio: "Adventurous and open-minded 🌟" },
  { id: 5, name: "Ishara", age: 27, location: "Colombo", bio: "Music, food and good vibes 🎵" },
  { id: 6, name: "Chathu", age: 25, location: "Matara", bio: "Let's see where this goes 💫" },
];

const DatingPage = () => {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-display font-bold mb-2">
        <span className="text-gradient">Dating</span>
      </h1>
      <p className="text-muted-foreground mb-8">Discover people near you.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProfiles.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card rounded-lg border border-border overflow-hidden hover-glow hover:border-primary/40 transition-all"
          >
            <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-display font-bold text-primary">
                {p.name[0]}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-display font-semibold text-foreground">{p.name}, {p.age}</h3>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{p.location}
                  </span>
                </div>
              </div>
              <p className="text-sm text-secondary-foreground mb-4">{p.bio}</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1 gap-1">
                  <X className="w-4 h-4" /> Pass
                </Button>
                <Button variant="hero" size="sm" className="flex-1 gap-1">
                  <Heart className="w-4 h-4" /> Like
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DatingPage;
