export interface SampleStrategy {
    id: string;
    slug: string;
    name: string;
    businessType: string;
    description: string;
    goal: string;
    budget: string;
    icon: string;
    color: string;
    executiveSummary: string;
    audiences: {
        primary: {
            segment: string;
            demographics: { age: string; gender: string; income: string; location: string };
            interests: string[];
            behaviors: string[];
        };
        secondary: {
            segment: string;
            demographics: { age: string; };
            interests: string[];
        };
    };
    valueProps: string[];
    campaigns: {
        name: string;
        objective: string;
        description: string;
        creative: string;
    }[];
    adCopy: {
        headline: string;
        primaryText: string;
        cta: string;
    }[];
    targeting: {
        lookalikes: string[];
        retargeting: string[];
    };
}

export const SAMPLES_DATA: Record<string, SampleStrategy> = {
    "ecommerce": {
        id: "1",
        slug: "ecommerce",
        name: "EcoThreads",
        businessType: "E-commerce - Sustainable Fashion",
        description: "Sustainable clothing brand focused on eco-conscious consumers.",
        goal: "Conversions (Sales)",
        budget: "$5,000/month",
        icon: "🌿",
        color: "bg-green-100 text-green-600",
        executiveSummary: "For EcoThreads, the strategy focuses on visual storytelling to highlight the 'Farm-to-Closet' journey. We will utilize a Full-Funnel approach: Broad prospecting with dynamic product ads (DPA) to drive traffic, and retargeting campaigns focused on cart abandoners with a sustainability-focused value proposition.",
        audiences: {
            primary: {
                segment: "Eco-Conscious Millennials",
                demographics: { age: "25-40", gender: "All", income: "Middle-High", location: "USA (Urban Centers)" },
                interests: ["Sustainable living", "Slow fashion", "Recycling", "Patagonia", "Everlane"],
                behaviors: ["Engaged Shoppers", "Green living enthusiasts"]
            },
            secondary: {
                segment: "Ethical Gift Shoppers",
                demographics: { age: "30-55" },
                interests: ["Ethical consumerism", "Handmade goods"]
            }
        },
        valueProps: [
            "100% Organic Materials - Verified Supply Chain",
            "Carbon Neutral Shipping on Every Order",
            "365-Day Durability Guarantee"
        ],
        campaigns: [
            {
                name: "TOFU - Brand Awareness",
                objective: "Traffic / Video Views",
                description: "Showcase the production process and founders' story.",
                creative: "15s Vertical Video 'Behind the Seams'"
            },
            {
                name: "MOFU - Prospecting",
                objective: "Conversions (Purchase)",
                description: "Drive sales using Dynamic Product Ads (Carousel).",
                creative: "Carousel of Best Sellers"
            },
            {
                name: "BOFU - Retargeting",
                objective: "Conversions (Purchase)",
                description: "Recover cart abandoners with social proof.",
                creative: "Single Image with 5-Star Review Overlay"
            }
        ],
        adCopy: [
            {
                headline: "Fashion That Feels Good (In Every Way)",
                primaryText: "Stop choosing between style and sustainability. 🌿 Experience the softness of 100% organic cotton, ethically stitched for longevity. Join 10,000+ happy customers making a difference.",
                cta: "Shop The Collection"
            }
        ],
        targeting: {
            lookalikes: ["1% LAL of Past Purchasers", "1% LAL of Top Web Visitors"],
            retargeting: ["Added to Cart (7 Days)", "Viewed Content (30 Days)", "Instagram Engagers"]
        }
    },
    "saas": {
        id: "2",
        slug: "saas",
        name: "TaskFlow",
        businessType: "SaaS - Project Management",
        description: "Project management tool for remote creative teams.",
        goal: "Leads (Free Trial)",
        budget: "$8,000/month",
        icon: "⚡",
        color: "bg-blue-100 text-blue-600",
        executiveSummary: "TaskFlow's strategy targets frustration with complex enterprise tools. We position TaskFlow as the 'Lightweight, Visual Alternative' for creative teams. The primary hook is a 'Chaos vs Order' comparison video driving users to a 14-day free trial.",
        audiences: {
            primary: {
                segment: "Remote Creative Directors",
                demographics: { age: "28-45", gender: "All", income: "High", location: "North America, UK, Australia" },
                interests: ["Asana", "Monday.com", "Remote work", "Productivity hacks"],
                behaviors: ["Facebook Page Admins (Business)", "Small Business Owners"]
            },
            secondary: {
                segment: "Freelance Designers",
                demographics: { age: "22-35" },
                interests: ["Freelancing", "Digital Nomad", "Graphic Design"]
            }
        },
        valueProps: [
            "Visual Kanban boards built for designers, not developers",
            "One-click client approval workflows",
            "Integrates with Figma & Slack instantly"
        ],
        campaigns: [
            {
                name: "Competitor Comparison",
                objective: "Leads",
                description: "Directly compare TaskFlow ui vs 'The Clunky Giants'.",
                creative: "Split Screen Video Comparison"
            },
            {
                name: "Feature Highlight",
                objective: "Leads",
                description: "Demonstrate the 'Client Approval' feature.",
                creative: "Screen recording with voiceover"
            }
        ],
        adCopy: [
            {
                headline: "Stop Herding Cats. Start Managing Design.",
                primaryText: "Tired of chasing clients for feedback? TaskFlow streamlines your entire creative workflow from brief to approval. Try it free for 14 days—no credit card required.",
                cta: "Start Free Trial"
            }
        ],
        targeting: {
            lookalikes: ["1% LAL of Current Subscribers"],
            retargeting: ["Visited Pricing Page", "Started Trial (did not convert)"]
        }
    },
    // Add placeholder for others to avoid crashes if accessed
    "restaurant": {
        id: "3", slug: "restaurant", name: "Bella Vita", businessType: "Restaurant", description: "Authentic Italian", goal: "Reservations", budget: "€800", icon: "🍝", color: "bg-orange-100", executiveSummary: "Placeholder strategy.", audiences: { primary: { segment: "Foodies", demographics: { age: "25+", gender: "All", income: "Any", location: "Local" }, interests: [], behaviors: [] }, secondary: { segment: "Couples", demographics: { age: "All" }, interests: [] } }, valueProps: [], campaigns: [], adCopy: [], targeting: { lookalikes: [], retargeting: [] }
    },
    "local-services": {
        id: "4", slug: "local-services", name: "Sparkle Cleaning", businessType: "Local Service", description: "Home Cleaning", goal: "Leads", budget: "$3000", icon: "✨", color: "bg-purple-100", executiveSummary: "Placeholder strategy.", audiences: { primary: { segment: "Homeowners", demographics: { age: "30+", gender: "All", income: "Any", location: "Local" }, interests: [], behaviors: [] }, secondary: { segment: "Busy Parents", demographics: { age: "All" }, interests: [] } }, valueProps: [], campaigns: [], adCopy: [], targeting: { lookalikes: [], retargeting: [] }
    },
    "b2b": {
        id: "5", slug: "b2b", name: "ProMach", businessType: "B2B Industrial", description: "Equipment Manufacturer", goal: "Quotes", budget: "$6000", icon: "🏗️", color: "bg-slate-100", executiveSummary: "Placeholder strategy.", audiences: { primary: { segment: "Plant Managers", demographics: { age: "40+", gender: "All", income: "Any", location: "National" }, interests: [], behaviors: [] }, secondary: { segment: "Procurement", demographics: { age: "All" }, interests: [] } }, valueProps: [], campaigns: [], adCopy: [], targeting: { lookalikes: [], retargeting: [] }
    }
};
