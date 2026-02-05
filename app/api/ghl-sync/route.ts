import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const supabase = await createClient();
    const { leadId } = await req.json();

    // 1. Validate Session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Fetch the lead data from Supabase
    const { data: lead, error: fetchError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();

    if (fetchError || !lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    try {
        const payload = {
            locationId: process.env.GHL_LOCATION_ID,
            email: lead.contact_email || lead.email,
            firstName: lead.contact_name || lead.business_name || "Meta Ads Lead",
            name: lead.contact_name || lead.business_name || "Meta Ads Lead",
            website: lead.website_url,
            customFields: [
                { key: 'contact.2_kads_ir_so_reklamu_galvenais_merkis', value: lead.primary_goal },
                { key: 'contact.3_kas_ir_tava_uznemuma_merka_klients', value: lead.target_audience },
                { key: 'contact.4_kadu_piedavajumu_velies_reklamet', value: lead.offer_details },
                { key: 'contact.5_uz_kadu_saiti_cilvekiem_vajadzetu_doties_pec_noklikskinasanas_uz_reklamas', value: lead.website_url },
                { key: 'ai_strategy_link', value: `${process.env.NEXT_PUBLIC_APP_URL}/strategy/${lead.id}` }
            ],
            tags: ['manus-ai-generator', 'meta-ads-lead']
        };

        // 2. Try to create contact
        let ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify(payload),
        });

        // 3. If duplicate, perform an update (Upsert logic)
        let ghlErrorText = '';
        if (!ghlResponse.ok && ghlResponse.status === 400) {
            const clonedResponse = ghlResponse.clone();
            const errorData = await clonedResponse.json();
            
            // Handle both common GHL duplicate error messages
            const isDuplicate = 
                errorData.message?.toLowerCase().includes('already exists') || 
                errorData.message?.toLowerCase().includes('duplicated contacts');

            if (isDuplicate) {
                // Try to get existingContactId from error metadata first (most efficient)
                let existingContactId = errorData.meta?.contactId;

                // If not in metadata, search for it
                if (!existingContactId) {
                    const searchResponse = await fetch(`https://services.leadconnectorhq.com/contacts/search?locationId=${process.env.GHL_LOCATION_ID}&query=${lead.contact_email || lead.email}`, {
                        headers: {
                            'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
                            'Version': '2021-07-28'
                        }
                    });
                    const searchData = await searchResponse.json();
                    existingContactId = searchData.contacts?.[0]?.id;
                }

                if (existingContactId) {
                    // Update the existing contact (Upsert)
                    // GHL Update endpoint (PUT) does not allow locationId in the body
                    const { locationId, ...updatePayload } = payload;
                    
                    ghlResponse = await fetch(`https://services.leadconnectorhq.com/contacts/${existingContactId}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${process.env.GHL_API_KEY}`,
                            'Content-Type': 'application/json',
                            'Version': '2021-07-28'
                        },
                        body: JSON.stringify(updatePayload),
                    });
                }
            } else {
                ghlErrorText = JSON.stringify(errorData);
            }
        }

        if (!ghlResponse.ok) {
            const errorText = ghlErrorText || await ghlResponse.text();
            console.error("GHL Sync Failed", errorText);
            throw new Error(`GHL Sync failed: ${errorText}`);
        }

        await supabase
            .from('leads')
            .update({ ghl_synced: true })
            .eq('id', leadId);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('GHL Sync Error:', error);
        return NextResponse.json({ error: 'Failed to sync lead to CRM' }, { status: 500 });
    }
}
