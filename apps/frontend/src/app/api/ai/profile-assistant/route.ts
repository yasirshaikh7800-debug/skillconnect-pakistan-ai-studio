import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { Type } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName = '',
      city = 'Karachi',
      category = 'Electrician',
      skills = '',
      rawExperience = '',
      targetRoleOrService = '',
    } = body;

    let aiOutput = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const prompt = `Refine and improve this Pakistani service worker or job seeker profile. Do NOT invent fake jobs, fake degrees, or false claims. Enhance the clarity, professional tone, and impact based ONLY on provided details.

User Input:
- Name: ${fullName}
- City: ${city}
- Field/Category: ${category}
- Provided Skills: ${skills}
- Raw Experience: ${rawExperience}
- Goal / Target Role: ${targetRoleOrService}

Return JSON with:
1. "professionalBio": Refined 2-3 sentence biography suitable for SkillConnect Pakistan profile.
2. "profileDescription": Engaging overview highlighting customer benefits and craftsmanship.
3. "skillsBullets": Array of 3-4 professional bullet points summarizing skills.
4. "cvSummary": High-impact 2-sentence summary for a resume/CV.
5. "jobIntro": Concise outreach note for clients or employers.
6. "missingSuggestions": Array of 3 key profile completion suggestions (e.g. "Add CNIC verification badge", "Upload portfolio photo").`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction:
              'You are the SkillConnect Pakistan AI Profile Copywriter. You create clean, authentic, customer-winning bios and summaries for Pakistani artisans, technicians, and digital freelancers without inventing false claims.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                professionalBio: { type: Type.STRING },
                profileDescription: { type: Type.STRING },
                skillsBullets: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                cvSummary: { type: Type.STRING },
                jobIntro: { type: Type.STRING },
                missingSuggestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'professionalBio',
                'profileDescription',
                'skillsBullets',
                'cvSummary',
                'jobIntro',
                'missingSuggestions',
              ],
            },
          },
        });

        if (response.text) {
          aiOutput = JSON.parse(response.text.trim());
        }
      } catch (err: any) {
        console.error('Gemini API Error in profile-assistant:', err);
      }
    }

    if (!aiOutput) {
      const nameStr = fullName || 'Technician';
      aiOutput = {
        professionalBio: `${nameStr} is a reliable ${category} based in ${city}, specializing in ${
          skills || 'high-quality repairs and installations'
        } with a focus on safety, promptness, and transparent PKR pricing.`,
        profileDescription: `Dedicated ${category} with practical experience serving residential and commercial clients across ${city}. Committed to NADRA CNIC verification, clean work practices, and 100% customer satisfaction.`,
        skillsBullets: [
          `Expertise in ${skills || category + ' troubleshooting & diagnostic maintenance'}`,
          `Punctual on-site service delivery across ${city}`,
          'Strict compliance with safety standards and transparent pricing',
        ],
        cvSummary: `Experienced ${category} in ${city} with a strong track record of successful client projects, quick diagnostic skills, and high customer review scores.`,
        jobIntro: `AOA! I am ${nameStr}, a CNIC-verified ${category} in ${city}. I saw your service request and would be glad to help resolve it promptly at a fair PKR rate.`,
        missingSuggestions: [
          '✓ Upload NADRA CNIC document for blue verification checkmark',
          '✓ Add 2-3 photos of previous completed work',
          '✓ Set specific hourly/flat PKR rates in your profile',
        ],
      };
    }

    return NextResponse.json(aiOutput);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate profile' }, { status: 500 });
  }
}
