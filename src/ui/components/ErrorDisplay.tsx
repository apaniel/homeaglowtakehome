import { View, Text } from 'react-native';

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <View className="mb-6 rounded-lg bg-fill-critical p-4">
      <Text className="font-body text-sm text-text-critical">{error}</Text>
    </View>
  );
};
