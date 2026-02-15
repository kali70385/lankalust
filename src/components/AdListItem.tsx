import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import type { UnifiedAd } from "@/data/unifiedAds";

interface Props {
  ad: UnifiedAd;
  index: number;
}

const AdListItem = ({ ad, index }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03, duration: 0.3 }}
  >
    <Link to={`/ad/${ad.id}`} className="block">
      <div className="flex gap-3 sm:gap-4 bg-card rounded-lg border border-border p-3 hover-glow hover:border-primary/40 transition-all cursor-pointer">
        {/* Image */}
        <div className="w-24 h-20 sm:w-32 sm:h-24 rounded-md overflow-hidden bg-muted shrink-0">
          {ad.image ? (
            <img
              src={ad.image}
              alt={ad.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-6 h-6 text-muted-foreground/50" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">{ad.title}</h3>
            {ad.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2">{ad.description}</p>
          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 truncate max-w-[140px] sm:max-w-[200px]">
              <MapPin className="w-3 h-3 shrink-0" />{ad.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{ad.time}
            </span>
            <span className="hidden sm:inline-block text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
              {ad.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default AdListItem;
