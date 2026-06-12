"use client";
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "mahasiswa" | "konselor";
  receiverId: string;
  text: string;
  timestamp: string;
};

export function ChatBubble({
  currentUserRole,
  currentUserId,
  currentUserName,
}: {
  currentUserRole: "mahasiswa" | "konselor";
  currentUserId: string;
  currentUserName: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contacts, setContacts] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const roleToFetch = currentUserRole === "mahasiswa" ? "konselor" : "mahasiswa";
    fetch(`/api/profiles?role=${roleToFetch}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setContacts(data.map((d: any) => ({ id: d.user_id, name: d.name })));
        }
      })
      .catch(() => {});
  }, [currentUserRole]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/chats?userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isOpen) {
      fetchChats();
      const interval = setInterval(fetchChats, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, currentUserId]);

  useEffect(() => {
    if (activeChatUserId) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChatUserId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !activeChatUserId) return;
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUserId,
          senderName: currentUserName,
          senderRole: currentUserRole,
          receiverId: activeChatUserId,
          text: inputText.trim(),
        }),
      });

      if (res.ok) {
        setInputText("");
        fetchChats();
      }
    } catch (e) {}
  };

  const activeContactName = contacts.find(c => c.id === activeChatUserId)?.name || "Chat";
  const filteredMessages = messages.filter(m => 
    (m.senderId === currentUserId && m.receiverId === activeChatUserId) ||
    (m.senderId === activeChatUserId && m.receiverId === currentUserId)
  );

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-[#006590] text-white rounded-full shadow-xl hover:bg-[#00405d] transition-transform hover:scale-105 z-50 border-2 border-white"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-[#e3e2e2] h-[500px]">
          <div className="bg-[#006590] p-4 text-white flex justify-between items-center border-b-4 border-[#004c6e] shrink-0">
            <div className="flex items-center gap-2">
              {activeChatUserId ? (
                <button onClick={() => setActiveChatUserId(null)} className="mr-1 hover:text-[#c8e6ff]">
                  <span className="text-xl leading-none font-bold">&larr;</span>
                </button>
              ) : (
                <MessageCircle className="w-5 h-5" />
              )}
              <h3 className="font-bold font-heading truncate max-w-[200px]">
                {activeChatUserId ? activeContactName : "Daftar Kontak"}
              </h3>
            </div>
            <button onClick={() => { setIsOpen(false); setActiveChatUserId(null); }} className="text-white hover:text-[#c8e6ff]">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {!activeChatUserId ? (
            <div className="flex-1 overflow-y-auto bg-[#faf9f9] flex flex-col">
              {contacts.map(c => (
                <div key={c.id} onClick={() => setActiveChatUserId(c.id)} className="p-4 border-b-2 border-[#e3e2e2] hover:bg-[#e6f4ff] cursor-pointer flex items-center gap-3 transition-colors">
                  <div className="w-10 h-10 bg-[#fec700] border-2 border-[#755b00] rounded-full flex items-center justify-center text-[#6e5400] font-bold text-lg shrink-0">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1a1c1c] truncate">{c.name}</p>
                    <p className="text-xs text-[#6e7881] mt-0.5">Ketuk untuk mulai chat</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-[#faf9f9] flex flex-col gap-3">
                {filteredMessages.length === 0 ? (
                  <p className="text-center text-sm text-[#6e7881] mt-auto mb-auto">
                    Belum ada pesan dengan {activeContactName}.
                  </p>
                ) : (
                  filteredMessages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex flex-col max-w-[85%] ${isMe ? "self-end items-end" : "self-start items-start"}`}>
                        <span className="text-[10px] text-[#6e7881] font-bold mb-1 ml-1 truncate max-w-full">{msg.senderName}</span>
                        <div className={`p-3 rounded-2xl border-2 ${isMe ? "bg-[#c8e6ff] border-[#88ceff] rounded-tr-none text-[#00405d]" : "bg-white border-[#e3e2e2] rounded-tl-none text-[#3e4850]"}`}>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 bg-white border-t-2 border-[#e3e2e2] flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-[#f4f3f3] border-2 border-[#e3e2e2] rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-[#1cb0f6]"
                />
                <button onClick={sendMessage} className="p-2 bg-[#87fe45] text-[#1f5100] border-2 border-[#51bd00] border-b-4 rounded-xl hover:bg-[#51bd00] hover:text-white transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
