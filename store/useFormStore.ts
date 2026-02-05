import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FormState {
    step: number;
    formData: {
        // Step 1
        businessName: string;
        website: string;
        industry: string;
        location: string;
        contactName: string;
        contactEmail: string;
        // Step 2
        goal: string;
        successMetrics: string;
        // Step 3
        monthlyBudget: string;
        timeline: string;
        duration: string;
        // Step 4
        challenges: string;
        extraContext: string;
    };
    setStep: (step: number) => void;
    updateFormData: (data: Partial<FormState['formData']>) => void;
    resetForm: () => void;
}

export const useFormStore = create<FormState>()(
    persist(
        (set) => ({
            step: 1,
            formData: {
                businessName: '', website: '', industry: '', location: '',
                contactName: '', contactEmail: '', goal: '', successMetrics: '',
                monthlyBudget: '', timeline: '', duration: '', challenges: '',
                extraContext: '',
            },
            setStep: (step) => set({ step }),
            updateFormData: (data) =>
                set((state) => ({ formData: { ...state.formData, ...data } })),
            resetForm: () => set({
                step: 1, formData: {
                    businessName: '', website: '', industry: '', location: '',
                    contactName: '', contactEmail: '', goal: '', successMetrics: '',
                    monthlyBudget: '', timeline: '', duration: '', challenges: '',
                    extraContext: '',
                }
            }),
        }),
        { name: 'meta-ads-form-storage' }
    )
);
