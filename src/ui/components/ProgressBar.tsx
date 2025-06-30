import { View } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar = ({ current, total }: ProgressBarProps) => {
  const progressPercentage = (current / total) * 100;

  return (
    <View className="h-1 rounded-full bg-fill-tertiary">
      <View
        className="h-1 rounded-full bg-button-fill-primary"
        style={{ width: `${progressPercentage}%` }}
      />
    </View>
  );
};
