// /api/eduai.js
// Serverless function (Vercel) — menjaga API key Gemini tetap di server,
// tidak pernah dikirim ke browser. Dipanggil oleh front-end lewat fetch('/api/eduai').

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // PENTING: nama environment variable di Vercel HARUS tanpa spasi.
  // Jika kamu menamainya "Gemini API" di dashboard, ubah namanya menjadi GEMINI_API_KEY
  // (Vercel tidak mengizinkan spasi pada nama environment variable).
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'GEMINI_API_KEY belum diset di Environment Variables Vercel. Tambahkan di Project Settings > Environment Variables, lalu redeploy.'
    });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { message, history } = body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Pesan kosong.' });
    return;
  }

  // Batasi riwayat & panjang teks supaya payload tetap wajar
  const trimmedHistory = Array.isArray(history) ? history.slice(-8) : [];
  const contents = [
    ...trimmedHistory.map(h => ({
      role: h.role === 'ai' ? 'model' : 'user',
      parts: [{ text: String(h.text || '').slice(0, 2000) }]
    })),
    { role: 'user', parts: [{ text: message.slice(0, 4000) }] }
  ];

  const systemInstruction = {
    parts: [{
      text: 'Kamu adalah EduAI, asisten belajar di dalam aplikasi kelas EduClass. ' +
            'Jawab dalam Bahasa Indonesia yang ramah, jelas, dan ringkas, cocok untuk siswa maupun guru. ' +
            'Bantu jelaskan materi pelajaran, jawab pertanyaan, atau berikan contoh soal jika diminta.'
    }]
  };

  // Bisa dioverride lewat env var GEMINI_MODEL jika perlu ganti model tanpa ubah kode.
  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest';

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents,
          systemInstruction,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 }
        })
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error('Gemini API error:', data);
      res.status(geminiRes.status).json({
        error: (data && data.error && data.error.message) || 'Gagal menghubungi Gemini API.'
      });
      return;
    }

    const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') || '';

    if (!text) {
      res.status(200).json({ text: 'Maaf, EduAI tidak bisa memberikan jawaban untuk pertanyaan ini.' });
      return;
    }

    res.status(200).json({ text });
  } catch (err) {
    console.error('EduAI handler error:', err);
    res.status(500).json({ error: 'Terjadi kesalahan saat menghubungi EduAI.' });
  }
}
