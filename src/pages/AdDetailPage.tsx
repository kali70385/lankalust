import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { findAdById } from "@/data/unifiedAds";
import {
    ArrowLeft, MapPin, Clock, CheckCircle, Tag, Phone,
    MessageCircle, ImageOff, UserCircle,
} from "lucide-react";

const AdDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const ad = id ? findAdById(id) : null;

    if (!ad) {
        return (
            <div className="container py-16 text-center">
                <h1 className="text-2xl font-display font-bold mb-4">Ad Not Found</h1>
                <p className="text-muted-foreground mb-6">This ad may have been removed or the link is invalid.</p>
                <Link to="/ads">
                    <Button variant="hero" size="lg" className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Browse Ads
                    </Button>
                </Link>
            </div>
        );
    }

    const phoneNumber = ad.contact?.replace(/[\s\-()]/g, "") || "";
    // Format for WhatsApp: ensure +94 prefix
    const waNumber = phoneNumber.startsWith("+")
        ? phoneNumber.replace("+", "")
        : phoneNumber.startsWith("0")
            ? "94" + phoneNumber.slice(1)
            : phoneNumber;

    return (
        <div className="container py-8 max-w-3xl">
            {/* Back button */}
            <Link to="/ads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" /> Back to Ads
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Main card */}
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {/* Image */}
                    {ad.image ? (
                        <div className="w-full aspect-[16/9] max-h-[400px] bg-muted">
                            <img
                                src={ad.image}
                                alt={ad.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full aspect-[16/9] max-h-[300px] bg-muted/30 flex items-center justify-center">
                            <ImageOff className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {/* Category + Verified + Time */}
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                            <span className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center gap-1">
                                <Tag className="w-3 h-3" /> {ad.category}
                            </span>
                            {ad.verified && (
                                <span className="text-xs font-medium bg-green-500/10 text-green-500 rounded-full px-3 py-1 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                                <Clock className="w-3 h-3" /> {ad.time}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-display font-bold mb-3">{ad.title}</h1>

                        {/* Price */}
                        {ad.price && (
                            <div className="mb-3">
                                <span className="text-xl font-bold text-primary">
                                    LKR {Number(ad.price).toLocaleString()}
                                </span>
                            </div>
                        )}

                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{ad.location}</span>
                        </div>

                        {/* Description */}
                        <div className="border-t border-border pt-4 mb-6">
                            <h2 className="text-sm font-semibold text-foreground mb-2">Description</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {ad.description}
                            </p>
                        </div>

                        {/* Contact Section */}
                        {ad.contact && (
                            <div className="border-t border-border pt-5">
                                <h2 className="text-sm font-semibold text-foreground mb-3">Contact</h2>
                                <div className="flex flex-col gap-2.5 max-w-sm">
                                    {/* Phone Call */}
                                    <a href={`tel:${phoneNumber}`} className="block">
                                        <Button variant="secondary" className="w-full justify-start gap-3 h-11">
                                            <Phone className="w-4 h-4" /> Call {ad.contact}
                                        </Button>
                                    </a>

                                    {/* WhatsApp */}
                                    {ad.whatsapp && (
                                        <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full justify-start gap-3 h-11 bg-green-600 hover:bg-green-700 text-white">
                                                <MessageCircle className="w-4 h-4" /> WhatsApp
                                            </Button>
                                        </a>
                                    )}

                                    {/* Viber */}
                                    {ad.viber && (
                                        <a href={`viber://chat?number=${phoneNumber.startsWith("+") ? phoneNumber : "+" + (phoneNumber.startsWith("0") ? "94" + phoneNumber.slice(1) : phoneNumber)}`} className="block">
                                            <Button className="w-full justify-start gap-3 h-11 bg-purple-600 hover:bg-purple-700 text-white">
                                                <MessageCircle className="w-4 h-4" /> Viber
                                            </Button>
                                        </a>
                                    )}

                                    {/* Telegram */}
                                    {ad.telegram && (
                                        <a href={`https://t.me/${waNumber}`} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full justify-start gap-3 h-11 bg-sky-600 hover:bg-sky-700 text-white">
                                                <MessageCircle className="w-4 h-4" /> Telegram
                                            </Button>
                                        </a>
                                    )}

                                    {/* IMO */}
                                    {ad.imo && (
                                        <a href={`https://imo.im/${phoneNumber}`} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button className="w-full justify-start gap-3 h-11 bg-blue-600 hover:bg-blue-700 text-white">
                                                <MessageCircle className="w-4 h-4" /> IMO
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Mock ad - no contact available */}
                        {!ad.contact && (
                            <div className="border-t border-border pt-5">
                                <p className="text-sm text-muted-foreground">Contact information not available for this listing.</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdDetailPage;
