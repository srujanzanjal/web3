import { useState, useEffect } from 'react';
import { apiService, UserProfile, Activity, Badge, PendingReward, LeaderboardUser } from '../services/api';

export const useApiData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // User data
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [pendingRewards, setPendingRewards] = useState<PendingReward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  
  // Computed values
  const tokenBalance = activities.reduce((sum, activity) => sum + activity.tokens_awarded, 0);
  const activitiesCount = activities.length;

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProfile();
      setProfile(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMyActivities();
      setActivities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMyBadges();
      setBadges(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch badges');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRewards = async () => {
    try {
      setLoading(true);
      const data = await apiService.getPendingRewards();
      setPendingRewards(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch pending rewards');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (activityData: {
    activity_type: string;
    distance?: number;
    duration?: number;
    date: string;
  }) => {
    try {
      setLoading(true);
      const newActivity = await apiService.logActivity(activityData);
      setActivities(prev => [newActivity, ...prev]);
      // Refresh other data after logging activity
      await Promise.all([
        fetchBadges(),
        fetchPendingRewards(),
        fetchLeaderboard()
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log activity');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardId: string) => {
    try {
      setLoading(true);
      const voucher = await apiService.claimReward(rewardId);
      // Refresh pending rewards after claiming
      await fetchPendingRewards();
      return voucher;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to claim reward');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchProfile(),
        fetchActivities(),
        fetchBadges(),
        fetchPendingRewards(),
        fetchLeaderboard()
      ]);
    };
    
    loadAllData();
  }, []);

  return {
    loading,
    error,
    profile,
    activities,
    badges,
    pendingRewards,
    leaderboard,
    tokenBalance,
    activitiesCount,
    logActivity,
    claimReward,
    refreshData: () => {
      fetchProfile();
      fetchActivities();
      fetchBadges();
      fetchPendingRewards();
      fetchLeaderboard();
    }
  };
};
