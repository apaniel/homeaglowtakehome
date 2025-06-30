// Mock API service for pay rate functionality
// In a real application, these would be actual API calls

export interface UserProfile {
  id: string;
  state: string;
}

export interface PayRatePolicy {
  state: string;
  allowsCustomRates: boolean;
  minimumRate: number;
  maximumRate: number;
  suggestedRate: number;
  hasCustomRatePolicy: boolean;
}

export interface PayRateSubmission {
  userId?: string;
  rate?: number;
  customNewClientRate?: number | null;
  state?: string;
}

const mockPolicies: Record<string, PayRatePolicy> = {
  CA: {
    state: 'CA',
    allowsCustomRates: true,
    minimumRate: 18,
    maximumRate: 150,
    suggestedRate: 20,
    hasCustomRatePolicy: true,
  },
  NY: {
    state: 'NY',
    allowsCustomRates: true,
    minimumRate: 16,
    maximumRate: 120,
    suggestedRate: 21,
    hasCustomRatePolicy: true,
  },
  WA: {
    state: 'WA',
    allowsCustomRates: false,
    minimumRate: 16,
    maximumRate: 100,
    suggestedRate: 25,
    hasCustomRatePolicy: false,
  },
  default: {
    state: 'DEFAULT',
    allowsCustomRates: false,
    minimumRate: 15,
    maximumRate: 80,
    suggestedRate: 20,
    hasCustomRatePolicy: false,
  },
};

export async function getPayRatePolicy(state: string): Promise<PayRatePolicy> {
  await delay(300);

  return mockPolicies[state] || mockPolicies.default;
}

export async function submitPayRate(submission: PayRateSubmission) {
  await delay(800); // Simulate API processing time

  // These validations would run in the backend
  // Validate submission
  const policy = mockPolicies[submission.state!] || mockPolicies.default;

  if (submission.rate! < policy.minimumRate) {
    throw new Error(`Rate must be at least $${policy.minimumRate}/hour`);
  }

  if (submission.rate! > policy.maximumRate) {
    throw new Error(`Rate cannot exceed $${policy.maximumRate}/hour`);
  }

  if (submission.customNewClientRate && !policy.allowsCustomRates) {
    throw new Error('Custom rates are not available in your state');
  }

  if (submission.customNewClientRate! < policy.minimumRate) {
    throw new Error(`New Client rate must be at least $${policy.minimumRate}/hour`);
  }

  if (submission.customNewClientRate! > policy.maximumRate) {
    throw new Error(`New Client rate cannot exceed $${policy.maximumRate}/hour`);
  }

  console.log('Pay rate submitted:', submission);
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
