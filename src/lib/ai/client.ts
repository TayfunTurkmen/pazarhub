import 'server-only';

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export function isAiEnabled(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export async function completeChat(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number },
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    return fallbackChat(messages);
  }

  const model = process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    console.error('[ai] OpenAI error:', response.status, detail);
    return fallbackChat(messages);
  }

  const json = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  return json.choices?.[0]?.message?.content?.trim() || fallbackChat(messages);
}

function fallbackChat(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content.toLowerCase() ?? '';

  if (/fiyat|price|bütçe|budget/.test(lastUser)) {
    return 'Bütçenize uygun ilanları bulmak için arama sayfasında fiyat aralığı belirleyebilir veya bana şehir, oda sayısı ve bütçenizi yazabilirsiniz. Size en uygun seçenekleri önerebilirim.';
  }
  if (/kira|rent|satılık|sale/.test(lastUser)) {
    return 'Satılık ve kiralık ilanları kategori filtreleriyle ayırabilirsiniz. Hangi şehir ve ilan tipini aradığınızı belirtirseniz size yönlendirme yapabilirim.';
  }
  if (/güven|güvenli|safe|doğrula/.test(lastUser)) {
    return 'Platformumuzda doğrulanmış satıcı rozeti olan ilanları tercih edebilirsiniz. Güvenli ödeme sayfamızda işlem koruma seçeneklerini inceleyebilirsiniz.';
  }
  if (/ilan|listing|emlak|konut|ev/.test(lastUser)) {
    return 'İlan vermek için ücretsiz kayıt olup "İlan Ver" adımlarını takip edebilirsiniz. Arama yapmak için ana sayfadaki arama kutusunu veya AI öneri panelini kullanabilirsiniz.';
  }

  return 'Merhaba! SahibindenKonutAl AI asistanınızım — 7/24 yanınızdayım. İlan arama, fiyat bilgisi, güvenli alışveriş veya platform kullanımı hakkında sorularınızı yanıtlayabilirim. Size nasıl yardımcı olabilirim?';
}
