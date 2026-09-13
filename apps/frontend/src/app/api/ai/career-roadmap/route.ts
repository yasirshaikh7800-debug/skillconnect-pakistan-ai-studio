import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { Type } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetRole = 'Full Stack Developer', timeframe = '6 Months' } = body;

    let aiOutput = null;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const prompt = `Generate a structured, step-by-step career learning roadmap for someone aiming to become a "${targetRole}" in Pakistan (timeframe: ${timeframe}).

Return JSON with an array "roadmapSteps".
Each step should have:
- "phase": e.g. "BEGINNER", "INTERMEDIATE", "ADVANCED", "JOB READY"
- "stepNumber": integer
- "title": e.g. "HTML & CSS Fundamentals"
- "whatToLearn": Concise summary of core topics
- "whyItMatters": Practical reason
- "suggestedProject": A real-world project idea (e.g. "E-commerce landing page in PKR")
- "estimatedDifficulty": "Easy", "Medium", or "Hard"
- "prerequisites": string e.g. "None" or "Basic JS"`;

        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
          config: {
            systemInstruction:
              'You are the SkillConnect Pakistan AI Career Roadmap Architect. Build realistic, encouraging, and structured learning paths for tech and trade careers.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                targetRole: { type: Type.STRING },
                totalPhases: { type: Type.NUMBER },
                roadmapSteps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.NUMBER },
                      phase: { type: Type.STRING },
                      title: { type: Type.STRING },
                      whatToLearn: { type: Type.STRING },
                      whyItMatters: { type: Type.STRING },
                      suggestedProject: { type: Type.STRING },
                      estimatedDifficulty: { type: Type.STRING },
                      prerequisites: { type: Type.STRING },
                    },
                    required: [
                      'stepNumber',
                      'phase',
                      'title',
                      'whatToLearn',
                      'whyItMatters',
                      'suggestedProject',
                      'estimatedDifficulty',
                      'prerequisites',
                    ],
                  },
                },
              },
              required: ['roadmapSteps'],
            },
          },
        });

        if (response.text) {
          aiOutput = JSON.parse(response.text.trim());
        }
      } catch (err: any) {
        console.error('Gemini API Error in career-roadmap:', err);
      }
    }

    if (!aiOutput) {
      aiOutput = {
        targetRole,
        totalPhases: 4,
        roadmapSteps: [
          {
            stepNumber: 1,
            phase: 'BEGINNER',
            title: 'HTML5, CSS3 & Responsive Web Design',
            whatToLearn: 'Semantic tags, Flexbox, CSS Grid, media queries, Tailwind CSS basics.',
            whyItMatters: 'Forms the visual foundation of every website and web app.',
            suggestedProject: 'Pakistani Artisan Portfolio Landing Page',
            estimatedDifficulty: 'Easy',
            prerequisites: 'Basic Computer Literacy',
          },
          {
            stepNumber: 2,
            phase: 'BEGINNER',
            title: 'Modern JavaScript (ES6+)',
            whatToLearn: 'Variables, functions, DOM manipulation, promises, async/await, fetch API.',
            whyItMatters: 'Powers interactivity, dynamic content rendering, and API communication.',
            suggestedProject: 'Interactive PKR Currency Converter & Service Calculator',
            estimatedDifficulty: 'Medium',
            prerequisites: 'HTML & CSS',
          },
          {
            stepNumber: 3,
            phase: 'INTERMEDIATE',
            title: 'Git & GitHub Version Control',
            whatToLearn: 'Repositories, commits, branching, pull requests, GitHub actions.',
            whyItMatters: 'Essential for collaborating in software houses and open-source projects.',
            suggestedProject: 'Publish all mini-projects to a public GitHub profile.',
            estimatedDifficulty: 'Easy',
            prerequisites: 'Command line basics',
          },
          {
            stepNumber: 4,
            phase: 'INTERMEDIATE',
            title: 'React & Next.js Framework',
            whatToLearn: 'JSX, components, hooks (useState, useEffect), Next.js App Router, SSR/SSG.',
            whyItMatters: 'The #1 requested frontend stack across Pakistani tech companies.',
            suggestedProject: 'SkillConnect Pakistan Clone with Real Service Booking',
            estimatedDifficulty: 'Medium',
            prerequisites: 'JavaScript (ES6+)',
          },
          {
            stepNumber: 5,
            phase: 'ADVANCED',
            title: 'Node.js, Express & RESTful APIs',
            whatToLearn: 'Server setup, routing, middleware, JWT auth, database connections.',
            whyItMatters: 'Enables complete full-stack dynamic applications with persistent state.',
            suggestedProject: 'Secure Authentication & Service Booking Backend API',
            estimatedDifficulty: 'Hard',
            prerequisites: 'React & JS async concepts',
          },
          {
            stepNumber: 6,
            phase: 'JOB READY',
            title: 'Database (PostgreSQL / MongoDB) & Deployment',
            whatToLearn: 'ORMs (Prisma/Drizzle), SQL queries, Cloud Run, Vercel, Docker basics.',
            whyItMatters: 'Prepares you to deliver end-to-end production-ready applications.',
            suggestedProject: 'Full-stack Multi-vendor Local Services Marketplace',
            estimatedDifficulty: 'Hard',
            prerequisites: 'Node.js & Express',
          },
        ],
      };
    }

    return NextResponse.json(aiOutput);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to generate roadmap' }, { status: 500 });
  }
}
