import { submitPayRate } from '../services/payRateService';
import { useUser } from './UserContext';
import { useReducer, useCallback, createContext, useContext, ReactNode } from 'react';

export interface OnboardingStep {
  id: string;
  title: string;
}

export interface PayRateData {
  payRate?: number;
  customNewClientRate?: number | null;
}

interface PayRateState {
  payRate?: number;
  customNewClientRate?: number | null;
  error?: string | null;
}

type PayRateAction =
  | { type: 'SET_PAY_RATE'; payload: number }
  | { type: 'SET_CUSTOM_NEW_CLIENT_RATE'; payload: number | null | undefined }
  | { type: 'SET_ERROR'; payload: string | null };

const reducer = (state: PayRateState, action: PayRateAction): PayRateState => {
  switch (action.type) {
    case 'SET_PAY_RATE': {
      return {
        ...state,
        payRate: action.payload,
        error: null,
      };
    }
    case 'SET_CUSTOM_NEW_CLIENT_RATE': {
      return {
        ...state,
        customNewClientRate: action.payload,
        error: null,
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

const initialState: PayRateState = {
  payRate: undefined,
  customNewClientRate: undefined,
  error: null,
};

type PayRateContextType = {
  payRateState: PayRateState;
  payRateSubmit: () => Promise<void>;
  updatePayRate: (payRate: number) => void;
  updateCustomNewClientRate: (customNewClientRate: number | null | undefined) => void;
  setError: (error: string | null) => void;
};

const PayRateContext = createContext<PayRateContextType | undefined>(undefined);

interface PayRateProviderProps {
  children: ReactNode;
}

export const PayRateProvider: React.FC<PayRateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useUser();

  const payRateSubmit = useCallback(async () => {
    await submitPayRate({
      userId: user?.id,
      rate: state.payRate,
      customNewClientRate: state.customNewClientRate,
      state: user?.state,
    });
  }, [user, state.payRate, state.customNewClientRate]);

  const updatePayRate = useCallback((payRate: number) => {
    dispatch({ type: 'SET_PAY_RATE', payload: payRate });
  }, []);

  const updateCustomNewClientRate = useCallback(
    (customNewClientRate: number | null | undefined) => {
      dispatch({ type: 'SET_CUSTOM_NEW_CLIENT_RATE', payload: customNewClientRate });
    },
    []
  );

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const value: PayRateContextType = {
    payRateState: state,
    payRateSubmit,
    updatePayRate,
    setError,
    updateCustomNewClientRate,
  };

  return <PayRateContext.Provider value={value}>{children}</PayRateContext.Provider>;
};

export const usePayRate = (): PayRateContextType => {
  const context = useContext(PayRateContext);
  if (!context) {
    throw new Error('usePayRate must be used within a PayRateProvider');
  }
  return context;
};
