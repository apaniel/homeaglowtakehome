import React, { createContext, useContext, useCallback, ReactNode, useReducer, useEffect } from 'react';
import { usePayRate, PayRateProvider } from '~/contexts/PayRateContext';
import { useUser } from './UserContext';

export interface OnboardingStep {
  id: string;
  title: string;
}

type OnboardingContextType = OnboardingState & {
  totalSteps: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  handleContinue: () => Promise<void>;
};

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

interface OnboardingState {
  currentStepIndex: number;
  currentStep: number;
  currentStepId: string;
  submitting: boolean;
  error: string | null;
  stepError: string | null | undefined;
}

type OnboardingAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_STEP_ERROR'; payload: string | null };

const reducer = (state: OnboardingState, action: OnboardingAction): OnboardingState => {
  switch (action.type) {
    case 'NEXT_STEP': {
      const newCurrentStepIndex =
        state.currentStepIndex < ONBOARDING_STEPS.length - 1 ? state.currentStepIndex + 1 : state.currentStepIndex;
      return {
        ...state,
        currentStepIndex: newCurrentStepIndex,
        currentStep: newCurrentStepIndex + 1,
        currentStepId: ONBOARDING_STEPS[newCurrentStepIndex].id,
      };
    }
    case 'PREVIOUS_STEP': {
      const newCurrentStepIndex = state.currentStepIndex > 0 ? state.currentStepIndex - 1 : state.currentStepIndex;
      return {
        ...state,
        currentStepIndex: newCurrentStepIndex,
        currentStep: newCurrentStepIndex + 1,
        currentStepId: ONBOARDING_STEPS[newCurrentStepIndex].id,
      };
    }
    case 'SET_SUBMITTING': {
      return {
        ...state,
        submitting: action.payload,
      };
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: action.payload,
      };
    }
    default:
      return state;
  }
};

const initialState: OnboardingState = {
  currentStepIndex: 1,
  currentStep: 2,
  currentStepId: ONBOARDING_STEPS[1].id,
  submitting: false,
  error: null,
  stepError: null,
};

const OnboardingInner: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useUser();
  const { payRateSubmit, payRateState } = usePayRate();

  const errorMap: Record<string, string | null | undefined> = {
    'pay-rate': payRateState.error,
  };

  const stepError = errorMap[state.currentStepId];

  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, [payRateState]);

  const goToNextStep = useCallback(() => {
    dispatch({ type: 'NEXT_STEP' });
  }, []);

  const goToPreviousStep = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'PREVIOUS_STEP' });
  }, []);

  const submitCurrentStep = useCallback(async () => {
    const stepId = ONBOARDING_STEPS[state.currentStepIndex].id;
    if (!user) {
      throw new Error('User not found');
    }

    if (stepId === 'pay-rate') {
      await payRateSubmit();
    }
  }, [state.currentStepIndex, user, payRateSubmit]);

  const handleContinue = useCallback(async () => {
    if (stepError || state.error) {
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      await submitCurrentStep();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      dispatch({ type: 'SET_SUBMITTING', payload: false });
      return;
    }

    setTimeout(() => {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
      dispatch({ type: 'NEXT_STEP' });
    }, 1000);
  }, [submitCurrentStep, stepError, state.error]);

  const value: OnboardingContextType = React.useMemo(
    () => ({
      ...state,
      totalSteps: ONBOARDING_STEPS.length,
      goToNextStep,
      goToPreviousStep,
      handleContinue,
      stepError,
    }),
    [state, handleContinue, goToNextStep, goToPreviousStep, stepError]
  );

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  return (
    <PayRateProvider>
      <OnboardingInner>{children}</OnboardingInner>
    </PayRateProvider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
