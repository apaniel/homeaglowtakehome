import { useState, useEffect, useCallback } from 'react';
import { getPayRatePolicy, PayRatePolicy } from '../services/payRateService';

interface UseRatePolicyReturn {
  policy: PayRatePolicy | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useRatePolicy = (state?: string): UseRatePolicyReturn => {
  const [policy, setPolicy] = useState<PayRatePolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPolicy = useCallback(async () => {
    if (!state) return;

    try {
      setLoading(true);
      setError(null);

      // Simulate 10% of the time the policy fails to load
      if (Math.random() > 0.9) {
        throw new Error();
      }

      // Fetch rate policy for user's state
      // Note: In a real app, we could prefetch this data in the background
      // when the user starts onboarding or even cache it locally
      const ratePolicy = await getPayRatePolicy(state);
      setPolicy(ratePolicy);
    } catch (err) {
      setError('Failed to load rate information. Please try again.');
      console.error('Error loading pay rate policy:', err);
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    fetchPolicy();
  }, [fetchPolicy]);

  return {
    policy,
    loading,
    error,
    refetch: fetchPolicy,
  };
};
