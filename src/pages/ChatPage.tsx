import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send, Users, User, Heart, Hash, Smile, Image as ImageIcon,
  LogOut, ArrowLeft, MessageCircle, X,
} from "lucide-react";

// ── Types ──
interface ChatUser {
  nickname: string;
  avatar?: string;
  bio: string;
  gender: "male" | "female" | "couple";
}

interface OnlineUser {
  name: string;
  gender: string;
  bio: string;
  avatar: string;
}

interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
  image?: string;
}

// ── Helpers ──
const genderColor = (g: string) => {
  if (g === "female") return "text-pink-400";
  if (g === "couple") return "text-amber-400";
  return "text-cyan-400";
};

const genderBg = (g: string) => {
  if (g === "female") return "bg-pink-500/20 text-pink-400 border-pink-500/30";
  if (g === "couple") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
};

const avatarLetter = (name: string) => name.charAt(0).toUpperCase();

// ── Constants ──
const rooms = [
  { id: "public", label: "Public Chat", icon: Hash },
  { id: "boys", label: "Boys Chat", icon: User },
  { id: "girls", label: "Girls Chat", icon: User },
  { id: "couples", label: "Couples Chat", icon: Heart },
];

const mockOnlineUsers: OnlineUser[] = [
  { name: "Kasun", gender: "male", bio: "Hey there! From Colombo 🌴", avatar: "" },
  { name: "Nimali", gender: "female", bio: "Looking for fun chats 💖", avatar: "" },
  { name: "Dilan", gender: "male", bio: "Chill vibes only 😎", avatar: "" },
  { name: "Sachini", gender: "female", bio: "New here, say hi!", avatar: "" },
  { name: "Ruwan", gender: "male", bio: "Night owl 🦉", avatar: "" },
  { name: "Thilini", gender: "female", bio: "Kandy girl ❤️", avatar: "" },
  { name: "RanilAndKusum", gender: "couple", bio: "Open-minded couple 💑", avatar: "" },
];

const mockRoomMessages: Record<string, Message[]> = {
  public: [
    { id: 1, user: "Kasun", text: "Hey everyone 👋", time: "2:30 PM" },
    { id: 2, user: "Nimali", text: "Hi! Anyone from Colombo?", time: "2:31 PM" },
    { id: 3, user: "Dilan", text: "What's up people", time: "2:33 PM" },
    { id: 4, user: "Sachini", text: "New here, hi all!", time: "2:35 PM" },
  ],
  boys: [
    { id: 1, user: "Kasun", text: "Guys only zone 💪", time: "2:30 PM" },
    { id: 2, user: "Dilan", text: "Sup boys", time: "2:32 PM" },
  ],
  girls: [
    { id: 1, user: "Nimali", text: "Hey girls! 💖", time: "2:30 PM" },
    { id: 2, user: "Sachini", text: "Hi babe!", time: "2:31 PM" },
  ],
  couples: [
    { id: 1, user: "RanilAndKusum", text: "Any couples looking to chat?", time: "2:30 PM" },
  ],
};

const emojiList = ["😀", "😂", "😍", "🔥", "💋", "❤️", "😘", "🥰", "😈", "💦", "👀", "🍑", "💪", "🙈", "😜", "🤤"];

// ── Component ──
const ChatPage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [showLogin, setShowLogin] = useState(true);

  // Login form state
  const [nickname, setNickname] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "couple">("male");

  // Chat state
  const [activeRoom, setActiveRoom] = useState("public");
  const [privateChatUser, setPrivateChatUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockRoomMessages);
  const [privateMessages, setPrivateMessages] = useState<Record<string, Message[]>>({});
  const [showEmoji, setShowEmoji] = useState(false);
  const [sideTab, setSideTab] = useState<"rooms" | "users">("rooms");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilePopup, setProfilePopup] = useState<OnlineUser | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editNick, setEditNick] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editGender, setEditGender] = useState<"male" | "female" | "couple">("male");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, privateMessages, activeRoom, privateChatUser]);

  // Build full online users list including current user
  const allOnlineUsers: OnlineUser[] = currentUser
    ? [
      { name: currentUser.nickname, gender: currentUser.gender, bio: currentUser.bio, avatar: currentUser.avatar || "" },
      ...mockOnlineUsers,
    ]
    : mockOnlineUsers;

  const handleLogin = () => {
    if (!nickname.trim()) return;
    setCurrentUser({ nickname: nickname.trim(), bio, gender });
    setShowLogin(false);
  };

  const handleLeaveChat = () => {
    setCurrentUser(null);
    setShowLogin(true);
    setPrivateChatUser(null);
    setNickname("");
    setBio("");
    setGender("male");
  };

  const currentTime = () =>
    new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const handleSend = () => {
    if (!message.trim() || !currentUser) return;
    const newMsg: Message = {
      id: Date.now(),
      user: currentUser.nickname,
      text: message,
      time: currentTime(),
    };

    if (privateChatUser) {
      setPrivateMessages((prev) => ({
        ...prev,
        [privateChatUser]: [...(prev[privateChatUser] || []), newMsg],
      }));
    } else {
      setMessages((prev) => ({
        ...prev,
        [activeRoom]: [...(prev[activeRoom] || []), newMsg],
      }));
    }
    setMessage("");
    setShowEmoji(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    const url = URL.createObjectURL(file);
    const newMsg: Message = {
      id: Date.now(),
      user: currentUser.nickname,
      text: "",
      time: currentTime(),
      image: url,
    };
    if (privateChatUser) {
      setPrivateMessages((prev) => ({
        ...prev,
        [privateChatUser]: [...(prev[privateChatUser] || []), newMsg],
      }));
    } else {
      setMessages((prev) => ({
        ...prev,
        [activeRoom]: [...(prev[activeRoom] || []), newMsg],
      }));
    }
    e.target.value = "";
  };

  const addEmoji = (emoji: string) => {
    setMessage((prev) => prev + emoji);
  };

  const startPrivateChat = (userName: string) => {
    setPrivateChatUser(userName);
    setProfilePopup(null);
    setSidebarOpen(false);
  };

  const currentMessages = privateChatUser
    ? privateMessages[privateChatUser] || []
    : messages[activeRoom] || [];

  const chatTitle = privateChatUser
    ? `Chat with ${privateChatUser}`
    : rooms.find((r) => r.id === activeRoom)?.label || "";

  // ── Login Modal ──
  if (showLogin) {
    return (
      <div className="container py-8">
        <Dialog open={showLogin} onOpenChange={() => navigate("/")}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-xl font-display">
                <span className="text-gradient">Enter Chat</span>
              </DialogTitle>
              <DialogDescription>Set up your profile to join the chat rooms.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="nickname">Nickname *</Label>
                <Input
                  id="nickname"
                  placeholder="Your display name"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="mt-1 bg-secondary border-border"
                  maxLength={20}
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value.slice(0, 300))}
                  className="mt-1 bg-secondary border-border h-20 resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{bio.length}/300</p>
              </div>

              <div>
                <Label>I am</Label>
                <RadioGroup value={gender} onValueChange={(v) => setGender(v as typeof gender)} className="flex gap-4 mt-2">
                  {[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "couple", label: "Couple" },
                  ].map((opt) => (
                    <div key={opt.value} className="flex items-center gap-1.5">
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label htmlFor={opt.value} className="cursor-pointer text-sm">{opt.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <Button variant="hero" className="w-full" onClick={handleLogin} disabled={!nickname.trim()}>
                <MessageCircle className="w-4 h-4 mr-2" /> Join Chat
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ── Main Chat UI ──
  return (
    <div className="container py-4 md:py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-display font-bold">
          <span className="text-gradient">Chat</span>
        </h1>
        <Button variant="ghost" size="sm" onClick={handleLeaveChat} className="text-destructive hover:text-destructive gap-1">
          <LogOut className="w-4 h-4" /> Leave
        </Button>
      </div>

      <div className="relative" style={{ height: "calc(100vh - 5rem)" }}>
        {/* Chat area — full width */}
        <div className="bg-card rounded-lg border border-border flex flex-col h-full">
          {/* Header with user info + hamburger */}
          <div className="p-3 border-b border-border shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {privateChatUser && (
                  <Button variant="ghost" size="sm" onClick={() => setPrivateChatUser(null)} className="text-xs gap-1 h-7 px-2">
                    <ArrowLeft className="w-3 h-3" />
                  </Button>
                )}
                <h3 className="font-semibold text-foreground text-sm">{chatTitle}</h3>
              </div>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-md hover:bg-secondary transition-colors"
                aria-label="Toggle rooms & users"
              >
                <span className={`block h-[2px] bg-foreground rounded transition-all duration-200 ${sidebarOpen ? "translate-y-[7px] rotate-45" : ""}`} style={{ width: 18 }} />
                <span className={`block h-[2px] bg-foreground rounded transition-all duration-200 ${sidebarOpen ? "opacity-0" : "opacity-100"}`} style={{ width: 18 }} />
                <span className={`block h-[2px] bg-foreground rounded transition-all duration-200 ${sidebarOpen ? "-translate-y-[7px] -rotate-45" : ""}`} style={{ width: 18 }} />
              </button>
            </div>
            {/* Current user brief info bar — click to edit */}
            {currentUser && (
              <button
                onClick={() => {
                  setEditNick(currentUser.nickname);
                  setEditBio(currentUser.bio);
                  setEditGender(currentUser.gender);
                  setEditingProfile(true);
                }}
                className="w-full flex items-center gap-2 mt-2 pt-2 border-t border-border/50 hover:bg-secondary/30 rounded-md px-1 -mx-1 transition-colors cursor-pointer"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${genderBg(currentUser.gender)} shrink-0`}>
                  {avatarLetter(currentUser.nickname)}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-foreground truncate">{currentUser.nickname}</span>
                  <span className={`text-[10px] capitalize ${genderColor(currentUser.gender)}`}>{currentUser.gender}</span>
                  {currentUser.bio && (
                    <span className="text-[10px] text-muted-foreground truncate hidden sm:inline">— {currentUser.bio}</span>
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 shrink-0 ml-auto" title="Online" />
              </button>
            )}
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-3">
              {currentMessages.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">No messages yet. Start the conversation!</p>
              )}
              {currentMessages.map((msg, i) => {
                const isMe = currentUser && msg.user === currentUser.nickname;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: isMe ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isMe ? "bg-primary/30 text-primary" : "bg-primary/20 text-primary"
                      }`}>
                      {avatarLetter(msg.user)}
                    </div>
                    <div className={`min-w-0 max-w-[75%] ${isMe ? "text-right" : ""}`}>
                      <div className={`flex items-baseline gap-2 ${isMe ? "justify-end" : ""}`}>
                        <span className={`text-sm font-semibold ${isMe ? "text-primary" : "text-foreground"}`}>{isMe ? "You" : msg.user}</span>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      </div>
                      {msg.text && (
                        <div className={`inline-block mt-0.5 px-3 py-1.5 rounded-xl text-sm break-words ${isMe
                          ? "bg-primary/20 text-primary-foreground rounded-tr-sm"
                          : "bg-secondary text-secondary-foreground rounded-tl-sm"
                          }`}>
                          {msg.text}
                        </div>
                      )}
                      {msg.image && (
                        <img src={msg.image} alt="shared" className={`mt-1 max-w-[120px] rounded-md border border-border ${isMe ? "ml-auto" : ""}`} />
                      )}
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Emoji picker */}
          <AnimatePresence>
            {showEmoji && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border overflow-hidden shrink-0"
              >
                <div className="p-2 flex flex-wrap gap-1">
                  {emojiList.map((e) => (
                    <button
                      key={e}
                      onClick={() => addEmoji(e)}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary text-lg"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input bar */}
          <div className="p-3 border-t border-border flex gap-2 items-center shrink-0">
            <button
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="bg-secondary border-border flex-1"
            />
            <Button variant="hero" size="icon" onClick={handleSend} className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Overlay sidebar — sliding panel */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 z-10 rounded-lg"
                onClick={() => setSidebarOpen(false)}
              />
              {/* Panel */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute top-0 right-0 bottom-0 w-72 bg-card border-l border-border z-20 rounded-r-lg flex flex-col overflow-hidden shadow-xl"
              >
                <Tabs value={sideTab} onValueChange={(v) => setSideTab(v as "rooms" | "users")} className="flex flex-col h-full">
                  <TabsList className="w-full rounded-none border-b border-border bg-secondary/50 shrink-0">
                    <TabsTrigger value="rooms" className="flex-1 text-xs">Rooms</TabsTrigger>
                    <TabsTrigger value="users" className="flex-1 text-xs">
                      <Users className="w-3 h-3 mr-1" /> Online ({allOnlineUsers.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="rooms" className="flex-1 overflow-auto p-2 space-y-0.5 mt-0">
                    {rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => { setActiveRoom(room.id); setPrivateChatUser(null); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${activeRoom === room.id && !privateChatUser
                          ? "bg-primary/20 text-primary"
                          : "text-foreground hover:bg-secondary"
                          }`}
                      >
                        <room.icon className="w-4 h-4" />
                        {room.label}
                      </button>
                    ))}
                  </TabsContent>

                  <TabsContent value="users" className="flex-1 overflow-auto p-2 space-y-0.5 mt-0">
                    {allOnlineUsers.map((u) => {
                      const isMe = currentUser && u.name === currentUser.nickname;
                      return (
                        <div
                          key={u.name}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${privateChatUser === u.name
                            ? "bg-primary/20"
                            : "hover:bg-secondary"
                            }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 cursor-pointer ${genderBg(u.gender)}`}
                            onClick={() => !isMe && setProfilePopup(u)}
                          >
                            {avatarLetter(u.name)}
                          </div>
                          {/* Name — clickable for popup */}
                          <button
                            className={`truncate text-left flex-1 ${isMe ? "text-primary font-semibold" : "text-foreground"}`}
                            onClick={() => !isMe ? setProfilePopup(u) : null}
                          >
                            {u.name} {isMe && <span className="text-[10px] text-muted-foreground">(You)</span>}
                          </button>
                          {/* Online dot */}
                          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                          {/* Chat icon — start private chat */}
                          {!isMe && (
                            <button
                              onClick={() => startPrivateChat(u.name)}
                              className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                              title={`Chat with ${u.name}`}
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </TabsContent>
                </Tabs>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* User Profile Popup Dialog */}
        <Dialog open={!!profilePopup} onOpenChange={(open) => !open && setProfilePopup(null)}>
          <DialogContent className="sm:max-w-xs bg-card border-border">
            {profilePopup && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-lg font-display">User Profile</DialogTitle>
                  <DialogDescription className="sr-only">Details about {profilePopup.name}</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center pt-2">
                  {/* Large avatar */}
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold border-2 mb-3 ${genderBg(profilePopup.gender)}`}>
                    {avatarLetter(profilePopup.name)}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{profilePopup.name}</h3>
                  <span className={`text-xs capitalize mt-0.5 ${genderColor(profilePopup.gender)}`}>{profilePopup.gender}</span>
                  {profilePopup.bio && (
                    <p className="text-sm text-muted-foreground text-center mt-2 px-4">{profilePopup.bio}</p>
                  )}
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs text-green-500 font-medium">Online</span>
                  </div>
                  <Button
                    variant="hero"
                    className="w-full mt-5 gap-2"
                    onClick={() => startPrivateChat(profilePopup.name)}
                  >
                    <MessageCircle className="w-4 h-4" /> Chat with {profilePopup.name}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit My Profile Popup Dialog */}
        <Dialog open={editingProfile} onOpenChange={(open) => !open && setEditingProfile(false)}>
          <DialogContent className="sm:max-w-xs bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-display">Edit Profile</DialogTitle>
              <DialogDescription className="sr-only">Edit your chat profile</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {currentUser && (
                <div className="flex justify-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-2 ${genderBg(editGender)}`}>
                    {editNick ? avatarLetter(editNick) : "?"}
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="editNick" className="text-xs">Nickname</Label>
                <Input
                  id="editNick"
                  value={editNick}
                  onChange={(e) => setEditNick(e.target.value)}
                  placeholder="Your display name"
                  className="mt-1 bg-secondary border-border"
                  maxLength={20}
                />
              </div>
              <div>
                <Label htmlFor="editBio" className="text-xs">Bio</Label>
                <Textarea
                  id="editBio"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value.slice(0, 300))}
                  placeholder="Tell us about yourself..."
                  className="mt-1 bg-secondary border-border h-20 resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{editBio.length}/300</p>
              </div>
              <div>
                <Label className="text-xs">I am</Label>
                <div className="flex gap-3 mt-2">
                  {(["male", "female", "couple"] as const).map((g) => (
                    <button
                      key={g}
                      onClick={() => setEditGender(g)}
                      className={`text-xs capitalize px-3 py-1 rounded-full border transition-colors ${editGender === g ? genderBg(g) : "border-border text-muted-foreground"}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                variant="hero"
                className="w-full"
                disabled={!editNick.trim()}
                onClick={() => {
                  if (currentUser) {
                    setCurrentUser({ ...currentUser, nickname: editNick.trim(), bio: editBio, gender: editGender });
                  }
                  setEditingProfile(false);
                }}
              >
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChatPage;
