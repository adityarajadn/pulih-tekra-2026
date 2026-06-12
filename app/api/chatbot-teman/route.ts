import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GEMINI_MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
Kamu adalah TEMAN, asisten virtual kesejahteraan mahasiswa PULIH.
Balas dalam bahasa Indonesia yang hangat, empatik, singkat, dan membantu.

Gunakan pendekatan Cognitive Behavioral Therapy (CBT) dalam merespons:
- Ingat bahwa "Cara kita berpikir memengaruhi cara kita merasa dan bertindak."
- Bantu pengguna mengenali pikiran negatif atau tidak rasional (distorsi kognitif) secara halus.
- Ajak pengguna menantang pikiran tersebut dengan pertanyaan reflektif (contoh: "Apakah ada bukti kuat yang mendukung pikiran tersebut?" atau "Adakah sudut pandang lain untuk melihat situasi ini?").
- Bantu mereka menemukan perspektif alternatif yang lebih seimbang dan realistis untuk mengelola emosinya.

Jangan menghakimi, jangan menggurui, dan jangan memberi diagnosis medis.

Jika pengguna membahas self-harm, bunuh diri, atau situasi krisis, prioritaskan keselamatan:
- akui perasaan pengguna dengan empati,
- sarankan mereka segera menghubungi orang terpercaya, konselor, layanan darurat lokal, atau tenaga profesional,
- ajak mereka menjauh dari benda berbahaya,
- tetap tenang dan suportif.

Jika konteksnya umum, bantu dengan pertanyaan terbuka dan langkah kecil yang praktis.
`;

type ChatMessage = {
  sender?: string;
  text?: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY belum diatur.' }, { status: 500 });
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : [];
    
    // 3. Trigger berbasis chatbot TEMAN
    // Deteksi frasa atau kata kunci kategori sinyal krisis
    const crisisKeywords = ['bunuh diri', 'ingin mati', 'menyakiti diri', 'melukai diri', 'tidak ingin hidup', 'putus asa', 'nyilet', 'mengakhiri hidup', 'gak mau hidup'];
    const lastUserMessage = messages.filter(m => m.sender === 'user').pop()?.text?.toLowerCase() || '';
    
    const isCrisis = crisisKeywords.some(keyword => lastUserMessage.includes(keyword));

    if (isCrisis) {
      // Hentikan percakapan reguler dan berikan pesan darurat
      const emergencyMessage = `🚨 **PERINGATAN DARURAT** 🚨

TEMAN mendeteksi bahwa kamu sedang mengalami situasi yang sangat berat dan mungkin berisiko bagi keselamatanmu. Keselamatanmu adalah hal yang paling utama.

Tolong, jangan hadapi ini sendirian. Kami siap membantumu. Segera hubungi salah satu layanan berikut (aktif 24 jam):
📞 **Hotline Konseling PULIH**: 119 ext. 8
📞 **Layanan Darurat**: 112
🏥 **UGD RS Universitas Brawijaya**

*Sistem secara otomatis telah mengeskalasi statusmu ke Jalur Merah. Konselor kami akan segera memberikan perhatian khusus untuk mendampingimu.*`;

      // Logika eskalasi status (dapat diintegrasikan dengan database)
      // Misalnya: await supabase.from('profiles').update({ status: 'merah' }).eq('user_id', userId);

      return NextResponse.json({ reply: emergencyMessage });
    }

    const formattedMessages = [
      { role: 'system', content: SYSTEM_INSTRUCTION.trim() },
      ...messages
        .filter((message) => typeof message?.text === 'string' && message.text.trim().length > 0)
        .slice(-12)
        .map((message) => ({
          role: message.sender === 'user' ? 'user' : 'assistant',
          content: message.text!.trim()
        }))
    ];

    if (formattedMessages.length <= 1) { // Only system message exists
      return NextResponse.json({ error: 'Pesan kosong.' }, { status: 400 });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'PULIH App'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: formattedMessages,
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 512
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const apiMessage = data?.error?.message || 'Gagal memanggil OpenRouter API.';
      return NextResponse.json({ error: apiMessage }, { status: response.status });
    }

    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: 'OpenRouter tidak mengembalikan teks.' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}