import { View, Text, TouchableOpacity } from 'react-native';

interface NumericInputProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  canIncrement: boolean;
  canDecrement: boolean;
  prefix?: string;
  suffix?: string;
}

export const NumericInput = ({
  value,
  onIncrement,
  onDecrement,
  canIncrement,
  canDecrement,
  prefix = '',
  suffix = '',
}: NumericInputProps) => {
  return (
    <View className="items-center">
      <View className="flex-row items-center justify-center">
        <TouchableOpacity
          onPress={onDecrement}
          disabled={!canDecrement}
          className={`h-12 w-12 items-center justify-center rounded-full ${
            !canDecrement ? 'bg-fill-tertiary' : 'bg-fill-secondary'
          }`}>
          <Text
            className={`text-2xl font-semibold ${
              !canDecrement ? 'text-text-disabled' : 'text-text-primary'
            }`}>
            −
          </Text>
        </TouchableOpacity>

        <View className={'mx-8'}>
          <Text className={`text-center font-display text-6xl font-semibold text-text-primary`}>
            {prefix}
            {value}
            {suffix}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onIncrement}
          disabled={!canIncrement}
          className={`h-12 w-12 items-center justify-center rounded-full ${
            !canIncrement ? 'bg-fill-tertiary' : 'bg-fill-secondary'
          }`}>
          <Text
            className={`text-2xl font-semibold ${
              !canIncrement ? 'text-text-disabled' : 'text-text-primary'
            }`}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
