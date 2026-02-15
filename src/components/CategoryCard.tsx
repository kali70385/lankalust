import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface CategoryCardProps {
  to: string;
  icon: LucideIcon;
  label: string;
  count: number;
  delay?: number;
}

const CategoryCard = ({ to, icon: Icon, label, count, delay = 0 }: CategoryCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Link to={to}>
      <div className="group relative bg-card rounded-lg p-3 border border-border hover-glow transition-all duration-300 hover:border-primary/50 hover:-translate-y-0.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-sm text-foreground truncate">{label}</h3>
            <span className="text-[10px] text-muted-foreground">{count} ads</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default CategoryCard;
