import { completeChat } from './client';
import { LEAD_QUALIFY_PROMPT } from './prompts';

export interface LeadInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

export interface LeadQualification {
  score: number;
  grade: 'hot' | 'warm' | 'cold';
  intent: 'buy' | 'rent' | 'sell' | 'info' | 'other';
  summary: string;
  nextAction: string;
  tags: string[];
}

function heuristicQualify(input: LeadInput): LeadQualification {
  const text = `${input.subject ?? ''} ${input.message}`.toLowerCase();
  let score = 40;
  const tags: string[] = [];

  if (/satın|satilik|almak|buy|purchase/.test(text)) {
    score += 25;
    tags.push('alıcı');
  }
  if (/kira|kiralik|rent/.test(text)) {
    score += 20;
    tags.push('kiracı');
  }
  if (/satmak|satış|sell|ilan ver/.test(text)) {
    score += 22;
    tags.push('satıcı');
  }
  if (/acil|hemen|bugün|urgent/.test(text)) {
    score += 15;
    tags.push('acil');
  }
  if (/bütçe|fiyat|tl|milyon|bin/.test(text)) {
    score += 10;
    tags.push('bütçe belirtti');
  }
  if (input.phone) {
    score += 8;
    tags.push('telefon var');
  }
  if (input.message.length > 100) score += 5;

  score = Math.min(100, score);

  let intent: LeadQualification['intent'] = 'info';
  if (/satın|satilik|almak|buy/.test(text)) intent = 'buy';
  else if (/kira|kiralik|rent/.test(text)) intent = 'rent';
  else if (/satmak|sell|ilan ver/.test(text)) intent = 'sell';

  const grade: LeadQualification['grade'] =
    score >= 75 ? 'hot' : score >= 50 ? 'warm' : 'cold';

  return {
    score,
    grade,
    intent,
    summary: `${input.name} — ${grade === 'hot' ? 'Yüksek potansiyelli' : grade === 'warm' ? 'Orta potansiyelli' : 'Düşük potansiyelli'} lead (${intent}).`,
    nextAction:
      grade === 'hot'
        ? '24 saat içinde telefonla arayın ve ilgili ilanları paylaşın.'
        : grade === 'warm'
          ? 'E-posta ile bilgi paketi gönderin ve takip planlayın.'
          : 'Otomatik bilgilendirme e-postası gönderin.',
    tags: tags.length ? tags : ['genel bilgi'],
  };
}

export async function qualifyLead(input: LeadInput): Promise<LeadQualification> {
  const payload = JSON.stringify(input);

  try {
    const raw = await completeChat(
      [
        { role: 'system', content: LEAD_QUALIFY_PROMPT },
        { role: 'user', content: payload },
      ],
      { temperature: 0.3, maxTokens: 512 },
    );

    const parsed = JSON.parse(raw) as LeadQualification;
    if (typeof parsed.score === 'number' && parsed.grade && parsed.summary) {
      return {
        score: Math.min(100, Math.max(0, parsed.score)),
        grade: parsed.grade,
        intent: parsed.intent ?? 'other',
        summary: parsed.summary,
        nextAction: parsed.nextAction ?? 'Takip e-postası gönderin.',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      };
    }
  } catch {
    // fall through to heuristic
  }

  return heuristicQualify(input);
}
