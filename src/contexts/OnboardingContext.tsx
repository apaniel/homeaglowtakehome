import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { submitPayRate } from '~/services/payRateService';
import { useUser } from './UserContext';

export interface OnboardingStep {
  id: string;
  title: string;
}

// Having the data from all steps in the same object does not scale, it would be better to have a proper state manager or improve this with a reducer per step
export interface OnboardingData {
  payRate?: number;
  customNewClientRate?: number | null;
}

interface OnboardingContextType {
  currentStepId: string;
  currentStep: number;
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  submitting: boolean;
  handleContinue: () => Promise<void>;
  error: string | null;
  updateData: (updates: Partial<OnboardingData>) => void;
  data: OnboardingData;
  stepError: string | null;
  setStepError: (error: string | null) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'pay-rate', title: 'Set your hourly rate' },
  { id: 'background-check', title: 'Background check' },
  { id: 'profile', title: 'Profile' },
  { id: 'documents', title: 'Documents' },
  { id: 'review', title: 'Review' },
  { id: 'complete', title: 'Complete' },
];

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [data, setData] = useState<OnboardingData>({});
  const { user } = useUser();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);

  const goToNextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < ONBOARDING_STEPS.length - 1) {
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const updateData = React.useCallback((updates: Partial<OnboardingData>) => {
    setError(null);
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const submitCurrentStep = useCallback(async () => {
    switch (ONBOARDING_STEPS[currentStep].id) {
      case 'pay-rate':
        await submitPayRate({
          userId: user?.id,
          rate: data.payRate,
          customNewClientRate: data.customNewClientRate,
          state: user?.state,
        });
        break;
      default:
        break;
    }
  }, [currentStep, user?.id, user?.state, data.payRate, data.customNewClientRate]);

  const handleContinue = useCallback(async () => {
    if (stepError || error) {
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await submitCurrentStep();
    } catch (error) {
      setError((error as Error).message);
      setSubmitting(false);
      return;
    }

    setTimeout(() => {
      setSubmitting(false);
      goToNextStep();
    }, 1000);
  }, [goToNextStep, submitCurrentStep, stepError, error]);

  const value: OnboardingContextType = {
    currentStepId: ONBOARDING_STEPS[currentStep].id,
    currentStep: currentStep + 1,
    totalSteps: ONBOARDING_STEPS.length,
    goToNextStep,
    goToPreviousStep,
    data,
    updateData,
    submitting,
    handleContinue,
    error,
    stepError,
    setStepError,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
