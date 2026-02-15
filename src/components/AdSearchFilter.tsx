import { Search, MapPin, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { districts, districtList } from "@/data/locations";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  district: string;
  onDistrictChange: (v: string) => void;
  city: string;
  onCityChange: (v: string) => void;
  onSearch: () => void;
}

const AdSearchFilter = ({ search, onSearchChange, district, onDistrictChange, city, onCityChange, onSearch }: Props) => {
  const cityOptions = district && district !== "all"
    ? districts[district.replace(" ", "_")] ?? []
    : [];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search ads..."
          className="pl-10 bg-card border-border"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <Select value={district} onValueChange={(v) => { onDistrictChange(v); onCityChange("all"); }}>
        <SelectTrigger className="w-full sm:w-[160px] bg-card border-border">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
          <SelectValue placeholder="District" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Districts</SelectItem>
          {districtList.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {cityOptions.length > 0 && (
        <Select value={city} onValueChange={onCityChange}>
          <SelectTrigger className="w-full sm:w-[160px] bg-card border-border">
            <SelectValue placeholder="City (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cityOptions.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Button variant="hero" className="shrink-0" onClick={onSearch}>Search</Button>
    </div>
  );
};

export default AdSearchFilter;
