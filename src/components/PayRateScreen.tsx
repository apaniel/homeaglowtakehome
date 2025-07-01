import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Container } from './Container';
import { useUser } from '../contexts/UserContext';
import { useRatePolicy } from '../hooks/useRatePolicy';
import { RateInput } from './RateInput';
import { ErrorDisplay } from '../ui/components/ErrorDisplay';
import { usePayRate } from '~/contexts/PayRateContext';

export const PayRateScreen = () => {
  const { payRateState, updatePayRate, setError } = usePayRate();
  const { user } = useUser();

  const { policy, loading, error, refetch } = useRatePolicy(user?.state);

  // Initialize data when policy loads and no payRate is set
  useEffect(() => {
    if (policy && !payRateState.payRate) {
      updatePayRate(policy.suggestedRate);
    }
  }, [policy, payRateState.payRate, updatePayRate]);

  const handleRateChange = (newRate: number) => {
    updatePayRate(newRate);

    if (policy && (newRate < policy.minimumRate || newRate > policy.maximumRate)) {
      setError(`Rate must be between ${policy.minimumRate} and ${policy.maximumRate}`);
      return;
    } else {
      setError(null);
    }
  };

  // Estimate jobs based on rate should be in a service
  const estimateJobs = (rate: number) => {
    if (rate <= 18) return 6;
    if (rate <= 22) return 4;
    if (rate <= 28) return 3;
    return 2;
  };

  if (loading) {
    return <LoadingRate />;
  }

  if (error) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center px-24">
          <Text className="mb-16 text-center font-display text-2xl font-semibold text-text-primary">
            Unable to load rate information
          </Text>
          <Text className="mb-32 text-center font-body text-lg text-text-secondary">{error}</Text>
          <TouchableOpacity
            onPress={refetch}
            className="rounded-12px bg-button-fill-primary px-24 py-12">
            <Text className="font-display text-lg font-semibold text-text-primary">Try Again</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }

  return (
    <View className="flex-1 px-24">
      <Text className="mb-16 font-display text-3xl font-semibold text-text-primary">
        Set your hourly rate
      </Text>
      <Text className="mb-48 font-body text-lg leading-6 text-text-secondary">
        Choose how much you want to earn on your cleanings. You can change this anytime.
      </Text>

      <RateInput
        currency={user?.currency}
        rate={payRateState.payRate ?? 0}
        onRateChange={handleRateChange}
        minRate={1}
        maxRate={1000}
        recommendedRate={policy?.suggestedRate}
      />

      {payRateState.error && <ErrorDisplay error={payRateState.error} />}

      <View className="mb-32 flex-row items-center rounded-12px bg-fill-secondary px-16 py-12">
        <Text className="font-body text-lg text-text-primary">
          📅 We estimate you&apos;ll get{' '}
          <Text className="font-semibold">
            {estimateJobs(payRateState.payRate ?? 0)} jobs a week
          </Text>
        </Text>
      </View>

      {policy?.hasCustomRatePolicy ? <CustomNewClientRate /> : <StandardNewClientRate />}
    </View>
  );
};

function LoadingRate() {
  return (
    <Container>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FED346" />
        <Text className="mt-16 font-body text-lg text-text-secondary">
          Loading pay rate options...
        </Text>
      </View>
    </Container>
  );
}

function StandardNewClientRate(): React.ReactNode {
  const { payRateState } = usePayRate();
  // TODO: get from an api
  const marketingFee = 5;

  const newClientRate = (payRateState.payRate ?? 0) - marketingFee;

  return (
    <View className="mb-32">
      <View className="mb-8 flex-row items-center justify-between">
        <Text className="font-display text-xl font-semibold text-text-primary">
          New client rate
        </Text>
        <Text className="font-display text-xl font-semibold text-text-primary">
          ${newClientRate}/hr
        </Text>
      </View>
      <Text className="text-md font-body leading-5 text-text-secondary">
        A ${marketingFee}/hr marketing fee will apply to your rate for new clients.
      </Text>
    </View>
  );
}

function CustomNewClientRate(): React.ReactNode {
  const { payRateState, updateCustomNewClientRate } = usePayRate();
  const { user } = useUser();
  const [customToggle, setCustomToggle] = useState(!!payRateState.customNewClientRate);

  const handleToggleCustomRate = () => {
    setCustomToggle(!customToggle);
    updateCustomNewClientRate(!customToggle ? payRateState.payRate : null);
  };

  const handleCustomRateChange = (rate: number) => {
    updateCustomNewClientRate(rate);
  };

  return (
    <View className="mb-32">
      <TouchableOpacity
        onPress={handleToggleCustomRate}
        className="mb-16 flex-row items-center justify-between rounded-12px bg-fill-secondary px-16 py-16">
        <View className="flex-1">
          <Text className="font-display text-lg font-semibold text-text-primary">
            Set new client rate
          </Text>
          <Text className="text-md font-body text-text-secondary">
            Choose a custom hourly rate for new clients.
          </Text>
        </View>
        <View
          className={`h-24 w-40 rounded-round ${
            customToggle ? 'bg-button-fill-primary' : 'bg-fill-secondary'
          }`}>
          <View
            className={`h-20 w-20 rounded-round bg-surface-primary shadow-raised transition-transform duration-200 ${
              customToggle ? 'translate-x-16' : 'translate-x-2'
            } mt-2`}
          />
        </View>
      </TouchableOpacity>

      {customToggle && (
        <View className="mb-16">
          <Text className="text-md mt-8 font-body leading-5 text-text-secondary">New clients.</Text>
          <RateInput
            currency={user?.currency}
            rate={payRateState.customNewClientRate || payRateState.payRate || 0}
            onRateChange={handleCustomRateChange}
            minRate={1}
            maxRate={1000}
          />
        </View>
      )}
    </View>
  );
}
