import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    let body;
    
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Determine the language for the AI response (default to 'en' if not provided)
        const locale = body.locale || 'en';
        const language = locale === 'lv' ? 'Latvian' : 'English';

        // 1. Prepare the Prompt
        const promptString = `You are a world-class senior Meta Ads expert and Media Buyer with 10+ years of experience in direct-response marketing. 
        Create a comprehensive, high-converting Meta Ads strategy for "${body.businessName}".
        
        CRITICAL: Generate the ENTIRE strategy document in ${language} language. All sections, headings, descriptions, ad copy, and recommendations must be written in ${language}. ${language === 'Latvian' ? 'Use formal Latvian language appropriate for professional business context.' : ''}
        
        CORE BUSINESS INTELLIGENCE:
        - Website: ${body.website}
        - Industry: ${body.industry}
        - Core Offer to Lead with: ${body.offerTitle}
        - Offer Details: ${body.offerDetails}
        - Primary Goal: ${body.goal}
        
        TARGET AUDIENCE PROFILING:
        - Ideal Customer Description: ${body.targetAudience}
        - Key Pain Points Solved: ${body.painPoints || "General industry pain points"}
        - Target Geography: ${body.location}
        
        AD SPEND & CONTEXT:
        - Monthly Budget: €${body.monthlyBudget}
        - Previous Experience: ${body.previousExperience}
        - Desired Duration: ${body.duration}
        
        CRITICAL MARKET CONSIDERATIONS:
        - ALWAYS analyze the website and strategy through the lens of the TARGET GEOGRAPHY (${body.location})
        - Consider local market dynamics, language, cultural nuances, and business practices specific to ${body.location}
        - Tailor all recommendations to be relevant for businesses operating primarily in ${body.location}
        
        META ADVANTAGE+ BEST PRACTICES (MANDATORY):
        - For SMALL COUNTRIES (Latvia, Estonia, Lithuania, etc.): Recommend audiences of at least 100,000+ people
        - For MEDIUM COUNTRIES (Netherlands, Belgium, Switzerland, etc.): Recommend audiences of at least 250,000+ people  
        - For LARGE COUNTRIES (USA, UK, Germany, France, etc.): Recommend audiences of at least 500,000+ people
        - ALWAYS prioritize Advantage+ Shopping Campaigns and broad targeting over narrow interest-based targeting
        - Emphasize automated placements, dynamic creative, and letting Meta's algorithm optimize delivery
        - Recommend testing Broad Audiences first before trying detailed targeting
        - Suggest multiple ad sets only when testing significantly different value propositions or offers
        
        INSTRUCTIONS:
        1. FIRST, browse the provided website to understand their brand voice, product quality, and market positioning IN THE CONTEXT OF ${body.location}
        2. THEN, write a full-funnel Meta Ads campaign plan including:
           - Concise Website Analysis (2-3 sentences) that considers the local market context
           - Campaign Structure (TOFU/MOFU/BOFU) optimized for Advantage+ and "${body.offerTitle}"
           - 2 Detailed Buyer Personas with Meta Advantage+ targeting specifics (ensuring minimum audience sizes)
           - 2 High-Converting "AIDA" Ad Copy Hooks that resonate with the local market
           - Budget Allocation & Scaling Roadmap following Meta best practices
        
        OUTPUT RULES:
        - Use professional, high-impact Markdown with proper tables for budget breakdown
        - Ensure total word count is between 1000 - 1500 words
        - The strategy MUST be actionable and optimized for Meta Advantage+ implementation
        - Include specific audience size estimates and ensure they meet the minimum thresholds above
        - Do not just browse; provide the FINAL COMPLETE STRATEGY DOCUMENT with all sections
        - Always consider ${body.location} market specifics in your recommendations`;

        // 2. Call Manus AI
        const manusResponse = await fetch('https://api.manus.ai/v1/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'API_KEY': process.env.MANUS_API_KEY || '', // Ensure this isn't undefined
            },
            body: JSON.stringify({
                prompt: promptString,
                agentProfile: 'manus-1.6', 
                taskMode: 'agent',
                interactiveMode: false
            }),
        });

        const taskResult = await manusResponse.json();
        
        if (!manusResponse.ok) {
            console.error('Manus API Raw Error:', taskResult);
            return NextResponse.json({ error: 'Manus AI reported an error', details: taskResult }, { status: manusResponse.status });
        }

        const taskId = taskResult.data?.task_id || taskResult.task_id;
        const strategyMarkdown = `Task initiated. ID: ${taskId}`;

        // 3. Database Insert
        const { data, error: dbError } = await supabase
            .from('leads')
            .insert([
                {
                    user_id: user?.id,
                    business_name: body.businessName,
                    website_url: body.website,
                    industry: body.industry,
                    target_location: body.location,
                    contact_name: body.contactName,
                    contact_email: body.contactEmail,
                    primary_goal: body.goal,
                    success_description: `Offer: ${body.offerTitle}. Details: ${body.offerDetails}. Target Audience: ${body.targetAudience}`,
                    monthly_budget: parseFloat(body.monthlyBudget) || 0,
                    timeline: body.previousExperience,
                    duration: body.duration,
                    additional_challenges: body.painPoints,
                    extra_context: `History: ${body.previousExperience}`,
                    strategy_markdown: strategyMarkdown,
                },
            ])
            .select()
            .single();

        if (dbError) {
            console.error('Supabase DB Error:', dbError);
            return NextResponse.json({ error: 'Database save failed', details: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, leadId: data.id, taskId });

    } catch (err: any) {
        console.error('Critical Server Error:', err.message);
        return NextResponse.json({ error: 'Internal Server Error', message: err.message }, { status: 500 });
    }
}
