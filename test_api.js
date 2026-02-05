
async function testGenerateStrategy() {
    const testData = {
        businessName: "Peak Performance Supplements",
        website: "https://www.peakperformance.store",
        industry: "Retail & E-commerce",
        location: "London, United Kingdom",
        contactName: "Alex Richards",
        contactEmail: "test@peakperformance.store",
        goal: "Increase Sales",
        successMetrics: "We want to achieve a 3x Return on Ad Spend (ROAS) and generate at least 50 orders per week specifically from Meta Ads.",
        monthlyBudget: "2500",
        timeline: "Immediately (this week)",
        duration: "3 months (recommended minimum)",
        challenges: "Our main challenge is high competition in the sports nutrition space and high cart abandonment rates on mobile devices.",
        extraContext: "We have high-quality video content from athletes using our products that we want to utilize in the TOF (Top of Funnel) campaigns."
    };

    console.log('🧪 Testing /api/generate-strategy with full form data...\n');
    console.log('📤 Sending data:', JSON.stringify(testData, null, 2));

    try {
        const response = await fetch('http://localhost:3000/api/generate-strategy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });

        const result = await response.json();

        console.log('\n📥 Response Status:', response.status);
        console.log('📥 Response Data:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('\n✅ SUCCESS: Strategy generation API is working!');
            if (result.leadId) {
                console.log('🎯 Lead ID:', result.leadId);
                console.log('🔗 Strategy URL: http://localhost:3000/strategy/' + result.leadId);
            }
        } else {
            console.log('\n❌ FAILED: API returned error');
            console.log('Error:', result.error);
        }

    } catch (error) {
        console.log('\n❌ NETWORK ERROR:', error.message);
    }
}

testGenerateStrategy();
