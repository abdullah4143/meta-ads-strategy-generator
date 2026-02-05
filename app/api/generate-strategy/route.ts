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

        // 1. Prepare the Prompt
        const promptString = `You are a world-class senior Meta Ads expert and Media Buyer with 10+ years of experience in direct-response marketing. 
        Create a comprehensive, high-converting Meta Ads strategy for "${body.businessName}".
        
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
        
        INSTRUCTIONS:
        1. FIRST, browse the provided website to understand their brand voice and product quality.
        2. THEN, write a full-funnel Meta Ads campaign plan including:
           - Concise Website Analysis (1-2 sentences).
           - Campaign Structure (TOFU/MOFU/BOFU) specifically for "${body.offerTitle}".
           - 2 Detailed Buyer Personas with Meta targeting specifics.
           - 2 High-Converting "AIDA" Ad Copy Hooks.
           - Budget Allocation & Scaling Roadmap.
        
        OUTPUT RULES:
        - Use professional, high-impact Markdown.
        - Ensure total word count is between 800 - 1000 words.
        - The strategy must be actionable and ready for manual or Advantage+ implementation.
        - Do not just browse; provide the FINAL COMPLETE STRATEGY DOCUMENT.`;

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
