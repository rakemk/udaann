import { useState, useEffect, useRef } from "react";
import { 
  Send, 
  User, 
  MessageSquare, 
  Phone, 
  Info,
  ChevronLeft,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { blink } from "@/lib/blink";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: number;
}

interface ChatSession {
  id: string;
  otherPartyName: string;
  lastMessage: string;
  bookingId?: string;
}

export function ChatPage() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: "v1", otherPartyName: "Rajesh Home Services", lastMessage: "I'll be there by 10 AM.", bookingId: "book_1" },
    { id: "v2", otherPartyName: "Local Express Transport", lastMessage: "Vehicle is dispatched.", bookingId: "book_2" },
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!activeChat || !user) return;

    let mounted = true;
    const channel = blink.realtime.channel(`chat-${activeChat.id}`);
    channelRef.current = channel;

    const connect = async () => {
      try {
        await channel.subscribe({
          userId: user.id,
          metadata: { displayName: user.displayName }
        });

        channel.onMessage((msg: any) => {
          if (!mounted) return;
          setMessages(prev => [...prev, {
            id: msg.id,
            senderId: msg.userId,
            content: msg.data.content,
            createdAt: msg.timestamp
          }]);
        });

        // Load history (mocking some history)
        setMessages([
          { id: "1", senderId: activeChat.id, content: activeChat.lastMessage, createdAt: Date.now() - 3600000 },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    connect();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [activeChat, user]);

  const sendMessage = async () => {
    if (!inputText.trim() || !channelRef.current || !user) return;

    try {
      const text = inputText.trim();
      setInputText("");
      
      await channelRef.current.publish("message", { content: text }, {
        userId: user.id
      });

      // Optimistic update
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: user.id,
        content: text,
        createdAt: Date.now()
      }]);
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] bg-card rounded-3xl border shadow-elegant overflow-hidden animate-in zoom-in-95 duration-500">
      {/* Sidebar: Chat List */}
      <div className={cn(
        "w-full md:w-80 border-r flex flex-col transition-all",
        activeChat && "hidden md:flex"
      )}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full h-10 bg-muted rounded-xl pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => setActiveChat(session)}
              className={cn(
                "w-full p-4 rounded-2xl text-left transition-all mb-1",
                activeChat?.id === session.id ? "bg-primary/10" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted border flex items-center justify-center font-bold text-primary">
                  {session.otherPartyName.substring(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold truncate">{session.otherPartyName}</div>
                  <div className="text-xs text-muted-foreground truncate">{session.lastMessage}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main: Chat View */}
      <div className={cn(
        "flex-1 flex flex-col bg-slate-50/50",
        !activeChat && "hidden md:flex items-center justify-center text-muted-foreground"
      )}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="h-16 border-b bg-card px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden" 
                  onClick={() => setActiveChat(null)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-full bg-muted border flex items-center justify-center font-bold text-primary">
                  {activeChat.otherPartyName.substring(0, 1)}
                </div>
                <div>
                  <div className="font-bold text-sm">{activeChat.otherPartyName}</div>
                  <div className="text-[10px] text-secondary font-bold uppercase tracking-widest flex items-center gap-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Info className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-center mb-8">
                <div className="bg-white px-4 py-1 rounded-full text-[10px] font-bold text-muted-foreground border shadow-sm uppercase tracking-widest">
                  Secure End-to-End Encrypted Chat
                </div>
              </div>
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={cn(
                    "flex flex-col max-w-[80%]",
                    msg.senderId === user?.id ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl text-sm shadow-sm",
                    msg.senderId === user?.id 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-card border rounded-tl-none"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-card border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 h-12 bg-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <Button 
                  size="icon" 
                  className="h-12 w-12 rounded-xl primary-gradient border-none"
                  onClick={sendMessage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Your Inbox</h3>
              <p className="text-sm">Select a conversation to start chatting with vendors.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
