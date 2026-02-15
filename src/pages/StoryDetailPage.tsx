import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Eye, Heart, Clock, ArrowLeft, Share2 } from "lucide-react";
import { AdSpace } from "@/components/AdSpace";
import { walkathaCategories, getStoryById } from "@/data/storiesStore";

/** Renders story paragraphs with ad slots injected at 25%, 50%, 75% and the end */
const StoryContentWithAds = ({ content }: { content: string }) => {
    const paragraphs = useMemo(() => content.split("\n\n").filter(Boolean), [content]);
    const total = paragraphs.length;
    // Calculate insertion points
    const at25 = Math.max(1, Math.floor(total * 0.25));
    const at50 = Math.max(2, Math.floor(total * 0.50));
    const at75 = Math.max(3, Math.floor(total * 0.75));

    return (
        <div className="prose prose-sm prose-invert max-w-none mb-8">
            {paragraphs.map((paragraph, i) => (
                <div key={i}>
                    <p className="text-secondary-foreground leading-relaxed mb-4 text-[15px]">{paragraph}</p>
                    {i + 1 === at25 && <AdSpace slotKey="walkatha-story-content-1" className="flex justify-center py-3" />}
                    {i + 1 === at50 && <AdSpace slotKey="walkatha-story-content-2" className="flex justify-center py-3" />}
                    {i + 1 === at75 && <AdSpace slotKey="walkatha-story-content-3" className="flex justify-center py-3" />}
                </div>
            ))}
            {/* Ad at end of story */}
            <AdSpace slotKey="walkatha-story-content-4" className="flex justify-center py-3" />
        </div>
    );
};

const StoryDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const story = getStoryById(Number(id));
    const getCategoryName = (slug: string) =>
        walkathaCategories.find((c) => c.slug === slug)?.name || slug;

    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(story?.likes ?? 0);

    const handleLike = () => {
        if (liked) {
            setLiked(false);
            setLikeCount((c) => c - 1);
        } else {
            setLiked(true);
            setLikeCount((c) => c + 1);
        }
    };

    if (!story) {
        return (
            <div className="container py-16 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">Story Not Found</h1>
                <p className="text-muted-foreground mb-6">The story you're looking for doesn't exist.</p>
                <Button variant="hero" onClick={() => navigate("/stories")}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
                </Button>
            </div>
        );
    }

    return (
        <div className="container py-6 max-w-3xl mx-auto">
            {/* Back button */}
            <Button
                variant="ghost"
                size="sm"
                className="mb-4 gap-1.5 text-muted-foreground hover:text-foreground"
                onClick={() => navigate("/stories")}
            >
                <ArrowLeft className="w-4 h-4" /> Back to stories
            </Button>

            <motion.article
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border overflow-hidden"
            >
                {/* Hero image */}
                <div className="w-full h-48 sm:h-64 bg-secondary flex items-center justify-center relative">
                    {story.image ? (
                        <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground/30">
                            <BookOpen className="w-16 h-16" />
                            <span className="text-xs font-medium uppercase tracking-widest">WalKatha</span>
                        </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
                </div>

                <div className="p-6 sm:p-8 -mt-12 relative">
                    {/* Ad space – below image */}
                    <AdSpace slotKey="detail-below-image" className="flex justify-center mb-3" />

                    {/* Category badge */}
                    <span className="inline-block text-[11px] bg-primary/15 text-primary px-2 py-0.5 rounded capitalize mb-2">
                        {getCategoryName(story.category)}
                    </span>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">{story.title}</h1>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{story.time}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{story.views.toLocaleString()} views</span>
                    </div>

                    {/* Story content with ad slots at 25%, 50%, 75%, end */}
                    <StoryContentWithAds content={story.content} />


                    {/* Action bar */}
                    <div className="border-t border-border pt-5 flex items-center justify-between">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${liked
                                ? "bg-pink-500/20 border-pink-500/40 text-pink-400 scale-105"
                                : "border-border text-muted-foreground hover:border-pink-500/30 hover:text-pink-400"
                                }`}
                        >
                            <Heart className={`w-5 h-5 transition-all ${liked ? "fill-pink-400 text-pink-400" : ""}`} />
                            <span className="text-sm font-medium">{likeCount}</span>
                            <span className="text-xs hidden sm:inline">{liked ? "Liked" : "Like this story"}</span>
                        </button>

                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({ title: story.title, url: window.location.href });
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                }
                            }}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Share2 className="w-4 h-4" /> Share
                        </button>
                    </div>
                </div>
            </motion.article>
        </div>
    );
};

export default StoryDetailPage;
