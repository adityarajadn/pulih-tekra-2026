import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GEMINI_MODEL = 'gemini-2.5-flash';

const SYSTEM_INSTRUCTION = `
Kamu adalah TEMAN, asisten virtual kesejahteraan mahasiswa PULIH.
Balas dalam bahasa Indonesia yang hangat, empatik, singkat, dan membantu.
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
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY belum diatur.' }, { status: 500 });
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? (body.messages as ChatMessage[]) : [];
    const recentMessages = messages
      .filter((message) => typeof message?.text === 'string' && message.text.trim().length > 0)
      .slice(-12)
      .map((message) => ({
        role: message.sender === 'user' ? 'user' : 'model',
        parts: [{ text: message.text!.trim() }]
      }));

    if (recentMessages.length === 0) {
      return NextResponse.json({ error: 'Pesan kosong.' }, { status: 400 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION.trim() }]
        },
        contents: recentMessages,
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 512
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const apiMessage = data?.error?.message || 'Gagal memanggil Gemini API.';
      return NextResponse.json({ error: apiMessage }, { status: response.status });
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || '')
      .join('')
      .trim();

    if (!reply) {
      return NextResponse.json({ error: 'Gemini tidak mengembalikan teks.' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan server.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}