import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Container } from './Container';
import { useOnboarding, OnboardingProvider } from '../contexts/OnboardingContext';
import { ProgressBar } from '../ui/components/ProgressBar';
import { BackButton } from '../ui/components/BackButton';
import { PayRateScreen } from './PayRateScreen';
import { ErrorDisplay } from '../ui/components/ErrorDisplay';

const OnboardingFlowInner: React.FC = () => {
  const {
    currentStepId,
    currentStep,
    totalSteps,
    goToPreviousStep,
    handleContinue,
    submitting,
    error,
    stepError,
  } = useOnboarding();
  const showBackButton = currentStep !== 1;

  return (
    <Container>
      <View className="flex-1 bg-surface-primary">
        <View className="flex-row items-center justify-between px-24 pb-16 pt-48">
          {showBackButton ? <BackButton onPress={goToPreviousStep} /> : <View className="w-32" />}
          <Text className="font-display text-lg font-semibold text-text-primary">
            Step {currentStep} of {totalSteps}
          </Text>
          <View className="w-32" />
        </View>

        <View className="mx-24 mb-32">
          <ProgressBar current={currentStep} total={totalSteps} />
        </View>

        <View className="flex-1">
          <StepScreen currentStepId={currentStepId} />
        </View>

        {error && <ErrorDisplay error={error} />}

        <View className="mt-auto pb-32">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={submitting}
            className={`rounded-round px-16 py-16 ${
              submitting ? 'bg-button-fill-secondary-disabled' : 'bg-button-fill-primary'
            }`}>
            <Text
              className={`text-center font-display text-lg font-semibold ${
                submitting || stepError || error ? 'text-text-disabled' : 'text-text-primary'
              }`}>
              {submitting ? 'Saving...' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Container>
  );
};

export const OnboardingFlow: React.FC = () => {
  return (
    <OnboardingProvider>
      <OnboardingFlowInner />
    </OnboardingProvider>
  );
};

const StepScreen = ({ currentStepId }: { currentStepId: string }) => {
  switch (currentStepId) {
    case 'pay-rate':
      return <PayRateScreen />;
    default:
      return (
        <Container>
          <Text>OnboardingFlow {currentStepId}</Text>
        </Container>
      );
  }
};
