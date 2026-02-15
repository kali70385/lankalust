// ─── Dating Message Types ───────────────────────────────────────────
export interface DatingMessage {
  id: string;
  fromUserId: string;
  fromUsername: string;
  fromName: string;
  fromPhoto: string;
  toUserId: string;
  toUsername: string;
  toName: string;
  toPhoto: string;
  subject: string;
  body: string;
  createdAt: string; // ISO
  read: boolean;
  replyToId?: string; // id of the message being replied to
}

// ─── localStorage Key ───────────────────────────────────────────────
const MESSAGES_KEY = "lankalust_dating_messages";

// ─── Helpers ────────────────────────────────────────────────────────
function getMessages(): DatingMessage[] {
  try {
    return JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveMessages(messages: DatingMessage[]) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

// ─── Public API ─────────────────────────────────────────────────────

/** Send a new message */
export function sendMessage(msg: Omit<DatingMessage, "id" | "createdAt" | "read">): DatingMessage {
  const messages = getMessages();
  const newMsg: DatingMessage = {
    ...msg,
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages.push(newMsg);
  saveMessages(messages);
  return newMsg;
}

/** Get all messages received by a user (inbox) */
export function getInbox(userId: string): DatingMessage[] {
  return getMessages()
    .filter((m) => m.toUserId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Get all messages sent by a user */
export function getSentMessages(userId: string): DatingMessage[] {
  return getMessages()
    .filter((m) => m.fromUserId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Get conversation thread between two users (both directions), sorted oldest first */
export function getConversation(userId1: string, userId2: string): DatingMessage[] {
  return getMessages()
    .filter(
      (m) =>
        (m.fromUserId === userId1 && m.toUserId === userId2) ||
        (m.fromUserId === userId2 && m.toUserId === userId1)
    )
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

/** Get unread count for a user */
export function getUnreadCount(userId: string): number {
  return getMessages().filter((m) => m.toUserId === userId && !m.read).length;
}

/** Mark a single message as read */
export function markAsRead(messageId: string) {
  const messages = getMessages();
  const idx = messages.findIndex((m) => m.id === messageId);
  if (idx >= 0) {
    messages[idx].read = true;
    saveMessages(messages);
  }
}

/** Mark all messages in a conversation as read (for the receiving user) */
export function markConversationAsRead(currentUserId: string, otherUserId: string) {
  const messages = getMessages();
  let changed = false;
  for (const m of messages) {
    if (m.toUserId === currentUserId && m.fromUserId === otherUserId && !m.read) {
      m.read = true;
      changed = true;
    }
  }
  if (changed) saveMessages(messages);
}

/** Delete a message */
export function deleteMessage(messageId: string) {
  const messages = getMessages().filter((m) => m.id !== messageId);
  saveMessages(messages);
}

/** Group inbox by conversation partner (latest message per partner) */
export interface ConversationSummary {
  partnerId: string;
  partnerUsername: string;
  partnerName: string;
  partnerPhoto: string;
  lastMessage: DatingMessage;
  unreadCount: number;
  totalMessages: number;
}

export function getConversationSummaries(userId: string): ConversationSummary[] {
  const allMessages = getMessages();

  // Get all messages involving this user
  const userMessages = allMessages.filter(
    (m) => m.fromUserId === userId || m.toUserId === userId
  );

  // Group by conversation partner
  const partnerMap = new Map<string, DatingMessage[]>();
  for (const m of userMessages) {
    const partnerId = m.fromUserId === userId ? m.toUserId : m.fromUserId;
    if (!partnerMap.has(partnerId)) partnerMap.set(partnerId, []);
    partnerMap.get(partnerId)!.push(m);
  }

  // Build summaries
  const summaries: ConversationSummary[] = [];
  for (const [partnerId, msgs] of partnerMap) {
    msgs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const lastMessage = msgs[0];
    const unreadCount = msgs.filter((m) => m.toUserId === userId && !m.read).length;
    const partner = lastMessage.fromUserId === userId
      ? { name: lastMessage.toName, username: lastMessage.toUsername, photo: lastMessage.toPhoto }
      : { name: lastMessage.fromName, username: lastMessage.fromUsername, photo: lastMessage.fromPhoto };

    summaries.push({
      partnerId,
      partnerUsername: partner.username,
      partnerName: partner.name,
      partnerPhoto: partner.photo,
      lastMessage,
      unreadCount,
      totalMessages: msgs.length,
    });
  }

  // Sort by latest message
  summaries.sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime());
  return summaries;
}

/** Format date for display */
export function formatMessageDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
