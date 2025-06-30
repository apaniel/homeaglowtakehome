import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  state: string;
  city: string;
  currentPayRate?: number;
  isOnboardingComplete: boolean;
  currency: '$';
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching user data on app load
    // In a real app, this would be fetched from authentication/profile service
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: UserProfile = {
          id: 'user123',
          name: 'Jane Doe',
          email: 'jane@example.com',
          state: 'CA',
          city: 'San Francisco',
          currentPayRate: 25,
          isOnboardingComplete: false,
          currency: '$',
        };

        setUser(mockUser);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error fetching user profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser((prev) => ({ ...prev!, ...updates }));
    }
  };

  const value: UserContextType = {
    user,
    isLoading,
    error,
    updateUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
