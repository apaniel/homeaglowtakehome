import { UserProvider } from '~/contexts/UserContext';
import { StatusBar } from 'expo-status-bar';
import { Figtree_400Regular } from '@expo-google-fonts/figtree/400Regular';
import { Figtree_600SemiBold } from '@expo-google-fonts/figtree/600SemiBold';
import { Figtree_400Regular_Italic } from '@expo-google-fonts/figtree/400Regular_Italic';
import { Figtree_600SemiBold_Italic } from '@expo-google-fonts/figtree/600SemiBold_Italic';
import { useFonts } from 'expo-font';

import './global.css';
import { Platform } from 'react-native';
import { OnboardingFlow } from '~/components/OnboardingFlow';

export default function App() {
  useFonts({
    Figtree_400Regular,
    Figtree_600SemiBold,
    Figtree_400Regular_Italic,
    Figtree_600SemiBold_Italic,
  });

  return (
    <>
      {Platform.OS === 'web' && (
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap"
          rel="stylesheet"
        />
      )}
      <UserProvider>
        <OnboardingFlow />
      </UserProvider>
      <StatusBar style="auto" />
    </>
  );
}
