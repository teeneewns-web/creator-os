import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is missing in environment variables.' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an elite direct-response content strategist for US solopreneurs and creators.
Generate a high-converting 7-Day Content Plan strictly following this 7-day marketing sequence:
- Day 1: Attention & Pattern Interrupt (High curiosity, bold claim, or relatable hook)
- Day 2: Problem Agitation (Deep dive into the audience's real friction point)
- Day 3: Educate & Reframe (Shift their mindset; explain why common approaches fail)
- Day 4: Trust & Proof (Framework breakdown, personal case study, or micro-proof)
- Day 5: The Solution (Actionable process or native introduction of the core vehicle)
- Day 6: Handling Objections (Disarm time, money, complexity, or self-doubt)
- Day 7: Direct Conversion CTA (Clear action command aligned with their goal)

STRICT COMPLIANCE RULES:
1. Output format: Pure JSON with an array named "days" containing exactly 7 objects (dayNumber 1 to 7).
2. Each day object must contain:
   - "dayNumber": number (1-7)
   - "theme": string (Short, punchy title like "Day 1: The Broken Playbook")
   - "objective": string (1 concise sentence explaining the psychological focus)
   - "formatSpecs": string (Format and length, e.g. "Short Video | 30-45s" or "Carousel | 5-7 slides")
   - "hook": string (Pattern interrupt for the first 3 seconds)
   - "scriptBody": string (80-120 words ready-to-use script or body)
   - "visualDirection": string (Specific camera angle, B-roll prompt, or slide instructions)
   - "caption": string (Ready-to-copy caption with clean line breaks and relevant hashtags)
   - "cta": string (Clear call to action strictly matching their goal; NO cheap engagement bait)
   - "isLocked": boolean (MUST be false for dayNumber 1, MUST be true for dayNumbers 2 to 7)
3. Write completely in fluent, native English tailored to the US market.`;

    const userPrompt = `Input Details:
- Primary Goal: ${body.goal}
- Identity/Role: ${body.role}
- Target Platform: ${body.platform}
- Niche/Topic: ${body.niche}
- Target Audience: ${body.audience}
- Core Offer: ${body.offer || 'Audience Growth / No direct offer'}
- Brand Tone: ${body.tone}
- Preferred Format: ${body.format}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Planner generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Generation failed' },
      { status: 500 }
    );
  }
}