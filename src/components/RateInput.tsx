import { View, Text, TouchableOpacity } from 'react-native';
import { NumericInput } from '../ui/components/NumericInput';

interface RateInputProps {
  rate: number;
  onRateChange: (newRate: number) => void;
  minRate: number;
  maxRate: number;
  recommendedRate?: number;
  currency?: '$';
}

export const RateInput = ({
  rate,
  onRateChange,
  minRate,
  maxRate,
  recommendedRate,
  currency,
}: RateInputProps) => {
  const handleIncrement = () => {
    if (rate < maxRate) {
      onRateChange(rate + 1);
    }
  };

  const handleDecrement = () => {
    if (rate > minRate) {
      onRateChange(rate - 1);
    }
  };

  return (
    <View className="mb-8">
      <NumericInput
        value={rate}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        canIncrement={rate < maxRate}
        canDecrement={rate > minRate}
        prefix={currency}
      />

      {recommendedRate && (
        <View className="mt-4 flex-row items-center justify-center">
          <Text className="font-body text-base text-text-secondary">
            Recommended rate: ${recommendedRate}/hr
          </Text>
          <TouchableOpacity className="ml-2 h-5 w-5 items-center justify-center rounded-full bg-fill-tertiary">
            <Text className="font-body text-xs text-text-secondary">?</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
