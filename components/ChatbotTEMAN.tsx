import React, { useState, useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';

export function ChatbotTEMAN() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: 'Halo. Aku TEMAN, asisten virtual kesejahteraanmu. Ceritakan saja apa yang sedang membebanimu hari ini, aku di sini untuk mendengarkan.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => { (messagesEndRef as any).current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    
    const isCrisis = ['depresi', 'mati', 'bunuh diri', 'menyerah', 'putus asa'].some(keyword => userMsg.text.toLowerCase().includes(keyword));

    setTimeout(() => {
      setIsTyping(false);
      if (isCrisis) setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', isCrisis: true, text: 'Aku menangkap bahwa kamu sedang mengalami masa yang sangat berat. Keselamatanmu penting. Aku ingin menghubungkanmu dengan konselor profesional.' }]);
      else setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: 'Terima kasih sudah berbagi. Coba ambil waktu istirahat sejenak hari ini ya.' }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#ffdf92] text-[#6e5400] p-4 flex items-center gap-3 border-b-4 border-[#f4bf00] shrink-0 rounded-t-[1.3rem]">
        <div className="bg-white p-2 rounded-xl border-2 border-[#f4bf00]">
          <Bot className="w-6 h-6 text-[#755b00]" />
        </div>
        <div>
          <h2 className="font-heading text-lg leading-tight">TEMAN Chatbot</h2>
          <p className="text-xs font-bold uppercase tracking-wide">Asisten Mahasiswa</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#faf9f9]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl ${msg.sender === 'user' ? 'bg-white border-2 border-[#e3e2e2]' : 'bg-white border-2 border-[#f4bf00]'}`}>
              <div className="text-sm">{msg.text}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-white p-3 rounded-xl border-2 border-[#f4bf00]">...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t-2 border-[#e3e2e2] rounded-b-[1.3rem] shrink-0">
        <form onSubmit={handleSend} className="flex gap-3">
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Tulis pesanmu..." className="input-tactile flex-1 px-4 py-3 bg-[#faf9f9]" />
          <button className="btn-primary py-3 px-4">Kirim</button>
        </form>
      </div>
    </div>
  );
}
