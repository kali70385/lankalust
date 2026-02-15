import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mail, Send, ChevronLeft, Inbox, SendHorizonal, User } from "lucide-react";
import { useDatingAuth } from "@/contexts/DatingAuthContext";
import {
  getConversationSummaries,
  getConversation,
  markConversationAsRead,
  sendMessage,
  formatMessageDate,
  type ConversationSummary,
  type DatingMessage,
} from "@/data/datingMessages";

const DatingMailboxPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDatingLoggedIn, datingUser, setShowDatingAuthModal } = useDatingAuth();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<string | null>(searchParams.get("with"));
  const [thread, setThread] = useState<DatingMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Auth gate
  useEffect(() => {
    if (!isDatingLoggedIn) {
      setShowDatingAuthModal(true);
      navigate("/dating");
    }
  }, [isDatingLoggedIn, navigate, setShowDatingAuthModal]);

  // Load conversations
  useEffect(() => {
    if (datingUser) {
      setConversations(getConversationSummaries(datingUser.id));
    }
  }, [datingUser]);

  // Load thread when partner selected
  useEffect(() => {
    if (datingUser && activePartnerId) {
      const msgs = getConversation(datingUser.id, activePartnerId);
      setThread(msgs);
      markConversationAsRead(datingUser.id, activePartnerId);
      // Refresh summaries to update unread counts
      setConversations(getConversationSummaries(datingUser.id));
    }
  }, [datingUser, activePartnerId]);

  // Auto-scroll to bottom of thread
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  const openConversation = (partnerId: string) => {
    setActivePartnerId(partnerId);
    setSearchParams({ with: partnerId });
    setReplyText("");
  };

  const closeConversation = () => {
    setActivePartnerId(null);
    setSearchParams({});
    setReplyText("");
    // Refresh
    if (datingUser) {
      setConversations(getConversationSummaries(datingUser.id));
    }
  };

  const handleSendReply = () => {
    if (!datingUser || !activePartnerId || !replyText.trim()) return;
    setSending(true);

    // Find partner info from thread or conversations
    const partner = conversations.find((c) => c.partnerId === activePartnerId);
    if (!partner) { setSending(false); return; }

    sendMessage({
      fromUserId: datingUser.id,
      fromUsername: datingUser.username,
      fromName: datingUser.name,
      fromPhoto: datingUser.profilePhoto || "",
      toUserId: partner.partnerId,
      toUsername: partner.partnerUsername,
      toName: partner.partnerName,
      toPhoto: partner.partnerPhoto,
      subject: "Re: Message",
      body: replyText.trim(),
    });

    setReplyText("");
    // Refresh thread
    const msgs = getConversation(datingUser.id, activePartnerId);
    setThread(msgs);
    setConversations(getConversationSummaries(datingUser.id));
    setSending(false);
  };

  if (!datingUser) return null;

  const activePartner = conversations.find((c) => c.partnerId === activePartnerId);

  return (
    <div className="container py-8 max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/dating/profile")} className="gap-1.5 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to My Profile
      </Button>

      <div className="bg-card border border-border rounded-lg overflow-hidden min-h-[500px]">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-border bg-secondary/30">
          <Mail className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-display font-bold text-foreground">Mailbox</h1>
          <span className="text-xs text-muted-foreground ml-auto">
            {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {activePartnerId && activePartner ? (
            /* ─── Thread View ─── */
            <motion.div
              key="thread"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
            >
              {/* Thread header */}
              <div className="flex items-center gap-3 p-3 border-b border-border">
                <button
                  onClick={closeConversation}
                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                {activePartner.partnerPhoto ? (
                  <img
                    src={activePartner.partnerPhoto}
                    alt={activePartner.partnerName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-display font-bold text-primary">
                    {activePartner.partnerName[0]}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/dating/member/${activePartner.partnerId}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {activePartner.partnerName}
                  </Link>
                  <p className="text-xs text-muted-foreground">@{activePartner.partnerUsername}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[400px] min-h-[250px]">
                {thread.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  thread.map((msg) => {
                    const isMine = msg.fromUserId === datingUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[75%] ${isMine ? "order-2" : "order-1"}`}>
                          <div
                            className={`rounded-2xl px-4 py-2.5 text-sm ${
                              isMine
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-secondary text-foreground rounded-bl-md"
                            }`}
                          >
                            {msg.subject && msg.subject !== "Re: Message" && (
                              <p className={`text-xs font-semibold mb-1 ${isMine ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                                {msg.subject}
                              </p>
                            )}
                            <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                          </div>
                          <p className={`text-[10px] text-muted-foreground mt-1 ${isMine ? "text-right" : "text-left"}`}>
                            {formatMessageDate(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={threadEndRef} />
              </div>

              {/* Reply box */}
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <Textarea
                    className="bg-secondary border-border min-h-[44px] max-h-[120px] resize-none flex-1"
                    placeholder="Type your message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <Button
                    variant="hero"
                    size="sm"
                    className="self-end gap-1.5 shrink-0"
                    disabled={!replyText.trim() || sending}
                    onClick={handleSendReply}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Press Enter to send, Shift+Enter for new line</p>
              </div>
            </motion.div>
          ) : (
            /* ─── Conversation List ─── */
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {conversations.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <Inbox className="w-14 h-14 text-muted-foreground/20 mx-auto mb-4" />
                  <h3 className="text-lg font-display font-semibold text-foreground mb-1">No messages yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visit a member's profile to send them a private message.
                  </p>
                  <Button variant="hero" size="sm" onClick={() => navigate("/dating")} className="gap-1.5">
                    Browse Members
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {conversations.map((conv) => (
                    <button
                      key={conv.partnerId}
                      onClick={() => openConversation(conv.partnerId)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors text-left"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        {conv.partnerPhoto ? (
                          <img
                            src={conv.partnerPhoto}
                            alt={conv.partnerName}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center text-base font-display font-bold text-primary">
                            {conv.partnerName[0]}
                          </div>
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                            {conv.partnerName}
                          </span>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {formatMessageDate(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {conv.lastMessage.fromUserId === datingUser.id ? "You: " : ""}
                          {conv.lastMessage.body}
                        </p>
                      </div>

                      {/* Arrow */}
                      <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DatingMailboxPage;
