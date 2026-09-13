import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { Type } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      skills = '',
      education = '',
      experience = '',
      interests = '',
      careerGoal = '',
      location = 'Karachi',
      workType = 'Full-time',
    } = body;

    if (!skills && !careerGoal && !experience) {
      return NextResponse.json(
        { error: 'Please provide at least your current skills, experience, or career goal.' },
        { status: 400 },
      );
    }

    let aiOutput = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const prompt = `Analyze this Pakistani professional/student profile and generate realistic career skill matching tailored to the Pakistani job and freelancing market (e.g. Lahore, Karachi, Islamabad, Remote).

User Details:
- Current Skills: ${skills}
- Education: ${education}
- Experience: ${experience}
- Interests: ${interests}
- Career Goal: ${careerGoal}
- Preferred Location: ${location}
- Work Type: ${workType}

Provide structured output containing:
1. "matches": Array of 3-4 suitable career roles with titles, match percentage (0-100), key reason for match, and demand level in Pakistan.
2. "nextSkills": Array of 4-5 relevant skills to learn next to bridge the gap.
3. "skillGaps": Array of 3 key skill gaps.
4. "careerAdvice": A concise 2-sentence career recommendation tailored to Pakistan.`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction:
              'You are the expert SkillConnect Pakistan AI Career Counselor. You provide realistic, highly practical career guidance and skill matching for the Pakistani market.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                matches: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      role: { type: Type.STRING },
                      matchPercentage: { type: Type.NUMBER },
                      reason: { type: Type.STRING },
                      demandInPakistan: { type: Type.STRING },
                    },
                    required: ['role', 'matchPercentage', 'reason', 'demandInPakistan'],
                  },
                },
                nextSkills: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      importance: { type: Type.STRING },
                      estimatedTimeToLearn: { type: Type.STRING },
                    },
                    required: ['name', 'importance', 'estimatedTimeToLearn'],
                  },
                },
                skillGaps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                careerAdvice: { type: Type.STRING },
              },
              required: ['matches', 'nextSkills', 'skillGaps', 'careerAdvice'],
            },
          },
        });

        if (response.text) {
          aiOutput = JSON.parse(response.text.trim());
        }
      } catch (err: any) {
        console.error('Gemini API Error in skill-matcher:', err);
      }
    }

    // Fallback if API key missing or error occurs
    if (!aiOutput) {
      aiOutput = {
        matches: [
          {
            role: careerGoal || 'Frontend Web Developer',
            matchPercentage: 92,
            reason: `Your existing background in ${skills || 'technology'} aligns strongly with entry to mid-level technical roles in ${location}.`,
            demandInPakistan: 'High (Karachi, Lahore, Islamabad & Remote)',
          },
          {
            role: 'Full Stack JavaScript Engineer',
            matchPercentage: 84,
            reason: 'High market demand across Pakistani software houses and global remote client contracts.',
            demandInPakistan: 'Very High',
          },
          {
            role: 'UI/UX & Frontend Specialist',
            matchPercentage: 78,
            reason: 'Combines visual presentation with practical client web development.',
            demandInPakistan: 'Moderate to High',
          },
        ],
        nextSkills: [
          { name: 'React & Next.js', importance: 'Critical', estimatedTimeToLearn: '3-4 Weeks' },
          { name: 'TypeScript', importance: 'High', estimatedTimeToLearn: '2 Weeks' },
          { name: 'REST APIs & Node.js', importance: 'High', estimatedTimeToLearn: '3 Weeks' },
          { name: 'Git & GitHub Workflows', importance: 'Essential', estimatedTimeToLearn: '1 Week' },
        ],
        skillGaps: [
          'Production framework experience (Next.js / React)',
          'State management and server-side data fetching',
          'Version control with Git for team collaboration',
        ],
        careerAdvice: `Focus on building 2-3 real-world portfolio projects targeting Pakistani business needs or international remote clients from ${location}.`,
      };
    }

    return NextResponse.json(aiOutput);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to analyze skills' }, { status: 500 });
  }
}
