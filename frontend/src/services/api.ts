const API_BASE_URL = 'http://localhost:8000';

export interface UserProfile {
  wallet_address: string;
  join_date: string;
  ens_name?: string;
  avatar_seed: string;
}

export interface Activity {
  id: number;
  wallet_address: string;
  activity_type: string;
  distance?: number;
  duration?: number;
  date: string;
  tokens_awarded: number;
  status: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  mintDate: string;
  tokenId: string;
  rarity: string;
  ipfsUrl: string;
}

export interface PendingReward {
  id: string;
  type: string;
  title: string;
  description: string;
  amount: number;
  earnedDate: string;
}

export interface LeaderboardUser {
  address: string;
  ensName?: string;
  activities: number;
  tokens: number;
  badges: number;
  isCurrentUser: boolean;
}

export interface ClaimVoucher {
  domain: any;
  types: any;
  message: any;
  signature: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Auth endpoints
  async siweAuth(message: string, signature: string) {
    const response = await fetch(`${API_BASE_URL}/auth/siwe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, signature }),
    });
    if (!response.ok) throw new Error('SIWE authentication failed');
    return response.json();
  }

  async getProfile(): Promise<{ wallet_address: string; profile: UserProfile }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }

  // Activity endpoints
  async logActivity(activityData: {
    activity_type: string;
    distance?: number;
    duration?: number;
    date: string;
  }): Promise<Activity> {
    const response = await fetch(`${API_BASE_URL}/activities/log`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(activityData),
    });
    if (!response.ok) throw new Error('Failed to log activity');
    return response.json();
  }

  async getMyActivities(): Promise<Activity[]> {
    const response = await fetch(`${API_BASE_URL}/activities/me`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
  }

  // Rewards endpoints
  async getPendingRewards(): Promise<PendingReward[]> {
    const response = await fetch(`${API_BASE_URL}/rewards/pending`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch pending rewards');
    return response.json();
  }

  async claimReward(rewardId: string): Promise<ClaimVoucher> {
    const response = await fetch(`${API_BASE_URL}/rewards/claim`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ rewardId }),
    });
    if (!response.ok) throw new Error('Failed to claim reward');
    return response.json();
  }

  async getRewardHistory(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/rewards/history`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch reward history');
    return response.json();
  }

  // Leaderboard endpoint
  async getLeaderboard(): Promise<LeaderboardUser[]> {
    const response = await fetch(`${API_BASE_URL}/leaderboard`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch leaderboard');
    return response.json();
  }

  // Badges endpoint
  async getMyBadges(): Promise<Badge[]> {
    const response = await fetch(`${API_BASE_URL}/badges/me`, {
      headers: this.getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch badges');
    return response.json();
  }
}

export const apiService = new ApiService();
