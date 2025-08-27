import { useEffect, useState, useRef, useCallback } from "react";
import { useSession } from "@/providers/SessionProvider";
import { FirebaseService } from "@/lib/firebase/FirebaseService"; 
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  limit,
  startAfter,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import LoadingStickMan from "@/assets/StickManWalking.gif";

const db = FirebaseService.getInstance().getFireStoreDB();

type Message = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: any;
};

const MESSAGES_LIMIT = 20;

export default function GroupChat({ groupId }: { groupId: string }) {
  const { userId, user } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Load latest messages
  useEffect(() => {
    if (!groupId) return;

    const q = query(
      collection(db, "groups", groupId, "messages"),
      orderBy("createdAt", "desc"),
      limit(MESSAGES_LIMIT)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Message)
      );
      setMessages(msgs.reverse()); // reverse because we query desc
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    });

    return unsubscribe;
  }, [groupId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load older messages
  const loadMore = useCallback(async () => {
    if (!groupId || !lastDoc || loadingMore || !hasMore) return;
    setLoadingMore(true);

    const q = query(
      collection(db, "groups", groupId, "messages"),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(MESSAGES_LIMIT)
    );

    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const olderMsgs = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Message)
      );
      setMessages((prev) => [...olderMsgs.reverse(), ...prev]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } else {
      setHasMore(false);
    }

    setLoadingMore(false);
  }, [groupId, lastDoc, loadingMore, hasMore]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    await addDoc(collection(db, "groups", groupId, "messages"), {
      senderId: userId,
      senderName: user?.firstName || "Anon",
      text: input.trim(),
      createdAt: serverTimestamp(),
    });

    setInput("");
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <img src={LoadingStickMan} className="size-12" />
      </div>
    );
  }
  

  return (
    <div className="flex flex-col h-full border-t">
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2 space-y-3 border-b"
        onScroll={(e) => {
          const top = (e.target as HTMLDivElement).scrollTop;
          if (top === 0 && hasMore && !loadingMore) {
            loadMore();
          }
        }}
      >
        {loadingMore && (
          <div className="text-center text-xs text-muted-foreground">
            Loading older messages...
          </div>
        )}

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-xs px-3 pt-2 pb-1 rounded-xl shadow-md ${
              msg.senderId === userId
                ? "bg-indigo-500 text-white ml-auto"
                : "bg-white text-black"
            }`}
          >
            <div className="text-xs font-semibold opacity-70">
              {msg.senderName}
            </div>
            <div>{msg.text}</div>
            {msg.createdAt?.seconds && (
              <div className="text-[10px] opacity-50 mt-1 text-right">
                {new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </motion.div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="flex gap-2 p-2 border-t w-full bg-white"
      >
        <Input
          className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <Button
          className="bg-amber-300 hover:bg-amber-600 hover:border"
          type="submit"
        >
          Send
        </Button>
      </form>
    </div>
  );

}
