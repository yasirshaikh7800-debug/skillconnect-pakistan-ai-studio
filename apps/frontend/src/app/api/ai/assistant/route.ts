import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages = [] } = body;

    const userLastMessage = messages[messages.length - 1]?.content || 'Hello, how can SkillConnect Pakistan help me?';

    let reply = '';

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        
        const historyText = messages
          .slice(-6)
          .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
          .join('\n');

        const prompt = `${historyText}\nAssistant:`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction:
              'You are SkillConnect Pakistan AI Assistant. You help Pakistani citizens, artisans, freelancers, and clients find verified home services (electricians, plumbers, AC technicians, solar installers) and software/digital career guidance across 399 Pakistani cities. You understand local context (PKR currency, CNIC verification, JazzCash, EasyPaisa, NAVTTC/TEVTA trade courses, Pakistani tech market). Keep answers helpful, direct, concise, and polite in English with natural Pakistani context.',
          },
        });

        if (response.text) {
          reply = response.text.trim();
        }
      } catch (err: any) {
        console.error('Gemini API Error in chat assistant:', err);
      }
    }

    if (!reply) {
      const lower = userLastMessage.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('pkr') || lower.includes('rate')) {
        reply =
          'At SkillConnect Pakistan, all service prices are listed in upfront PKR. Standard diagnostic visits start from PKR 1,000 - PKR 2,500 depending on the city (Karachi, Lahore, Islamabad, etc.). Payments can be made via JazzCash, EasyPaisa, or Cash on Delivery.';
      } else if (lower.includes('cnic') || lower.includes('verify') || lower.includes('trust')) {
        reply =
          'All service providers on SkillConnect Pakistan undergo NADRA CNIC verification to ensure safety, authenticity, and peace of mind for Pakistani households and businesses.';
      } else if (lower.includes('city') || lower.includes('lahore') || lower.includes('karachi') || lower.includes('islamabad')) {
        reply =
          'SkillConnect Pakistan connects skilled professionals across 399 cities and all 7 provinces/regions. You can easily filter workers or job opportunities by your exact Pakistani city.';
      } else {
        reply =
          'SkillConnect Pakistan is your premier AI-powered skills, home services, and career platform. I can assist you with finding CNIC-verified technicians, matching your skills to high-demand careers, building an AI career roadmap, or optimizing your profile. What would you like to explore today?';
      }
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process chat' }, { status: 500 });
  }
}
