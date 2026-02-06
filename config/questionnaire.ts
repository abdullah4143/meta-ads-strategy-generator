export interface QuestionnaireField {
    id: string;
    label: string;
    type: "text" | "url" | "select" | "email" | "textarea" | "radio-cards" | "number" | "date" | "radio-group";
    placeholder?: string;
    description?: string;
    required?: boolean;
    options?: any[]; // Keep flexible for string[] or object[]
    footerNote?: string;
}

export interface QuestionnaireStep {
    step: number;
    title: string;
    progress: number;
    header: string;
    subtext: string;
    fields: QuestionnaireField[];
    footerNote?: string;
}

export const QUESTIONNAIRE_DATA: QuestionnaireStep[] = [
    {
        step: 1,
        title: "Business Profile",
        progress: 20,
        header: "Let's Define Your Business",
        subtext: "Our AI will analyze your website to understand your brand voice and offerings.",
        fields: [
            { id: "businessName", label: "Business Name *", type: "text", placeholder: "e.g., Peak Performance Supplements", required: true },
            { id: "website", label: "Website URL *", type: "url", placeholder: "https://example.com", description: "Our AI will analyze your website to understand your products, target audience, and value proposition", required: true },
            { id: "industry", label: "Industry *", type: "select", options: ["Restaurant & Food Service", "Retail & E-commerce", "Professional Services", "Health & Wellness", "Fitness & Sports", "Beauty & Personal Care", "Real Estate", "Home Services", "Education & Training", "Technology & Software", "Manufacturing", "Hospitality & Tourism", "Events & Entertainment", "Non-Profit", "Other"], required: true },
            { id: "location", label: "Primary Location/Region *", type: "text", placeholder: "Riga, Latvia (or Global)", description: "Where are your customers located?", required: true },
        ]
    },
    {
        step: 2,
        title: "The Offer",
        progress: 40,
        header: "What Are We Advertising?",
        subtext: "A great strategy starts with a clear offer. Tell us what you want to promote.",
        fields: [
            { 
                id: "offerTitle", 
                label: "Core Offer Title *", 
                type: "text", 
                placeholder: "e.g., 20% Off First Personal Training Session", 
                description: "This is the 'hook' that attracts attention.",
                required: true 
            },
            { 
                id: "offerDetails", 
                label: "Offer Details *", 
                type: "textarea", 
                placeholder: "Describe what's included, shipping times, or any specific constraints...", 
                description: "Give us enough detail to write high-converting ad copy.",
                required: true 
            },
            {
                id: "goal",
                label: "Campaign Primary Goal *",
                type: "radio-cards",
                required: true,
                options: [
                    { value: "leads", label: "Generate Leads", desc: "Get names, emails, and phone numbers" },
                    { value: "sales", label: "Direct Sales", desc: "Drive purchases on your store" },
                    { value: "traffic", label: "Website Traffic", desc: "Get people to read your content" },
                    { value: "awareness", label: "Brand Awareness", desc: "Show ads to people most likely to remember them" }
                ]
            }
        ]
    },
    {
        step: 3,
        title: "Target Audience",
        progress: 60,
        header: "Who is Your Ideal Client?",
        subtext: "We'll build custom audience segments based on these details.",
        fields: [
            { id: "targetAudience", label: "Describe Your Ideal Customer *", type: "textarea", placeholder: "e.g., Busy professionals aged 25-40 in Riga who value time and healthy eating...", required: true },
            { 
                id: "painPoints", 
                label: "What Problems Do You Solve?", 
                type: "textarea", 
                placeholder: "e.g., They don't have time to cook healthy meals...", 
                required: false 
            }
        ]
    },
    {
        step: 4,
        title: "Ad Spend & Experience",
        progress: 80,
        header: "Budget & History",
        subtext: "We'll adjust the scaling plan based on your budget and previous data.",
        fields: [
            { id: "monthlyBudget", label: "Estimated Monthly Ad Spend (€) *", type: "number", placeholder: "e.g., 500", required: true },
            { 
                id: "previousExperience", 
                label: "Previous Ad Experience", 
                type: "select", 
                options: ["I'm a complete beginner", "I've tried but didn't see results", "I have active campaigns running", "I'm looking to scale my successful ads"], 
                required: true 
            },
            { id: "duration", label: "Investment Duration", type: "select", options: ["1 month (testing)", "3 months (recommended)", "Ongoing"], required: true }
        ]
    },
    {
        step: 5,
        title: "Final Details",
        progress: 100,
        header: "Almost Done!",
        subtext: "Where should we send your custom strategy?",
        fields: [
            { id: "contactName", label: "Full Name *", type: "text", placeholder: "John Smith", required: true },
            { id: "contactEmail", label: "Work Email *", type: "email", placeholder: "john@company.com", required: true },
            {
                id: "responseLanguage",
                label: "Strategy Language *",
                type: "radio-cards",
                description: "Choose the language for your AI-generated strategy document",
                required: true,
                options: [
                    { value: "en", label: "English", desc: "Generate strategy in English" },
                    { value: "lv", label: "Latviešu", desc: "Ģenerēt stratēģiju latviešu valodā" }
                ]
            }
        ],
        footerNote: "Note: Your privacy is important. We only use this data to generate your strategy."
    }
];
