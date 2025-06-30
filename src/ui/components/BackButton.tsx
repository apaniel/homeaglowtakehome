import { TouchableOpacity, Text } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export const BackButton = ({ onPress }: BackButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} className="p-2">
      <Text className="text-2xl text-text-primary">←</Text>
    </TouchableOpacity>
  );
};
