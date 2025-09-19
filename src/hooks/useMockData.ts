import { useState, useEffect } from 'react';

export const useMockData = () => {
  const [tokenBalance] = useState(2450);
  const [activitiesCount] = useState(23);
  
  const [badges] = useState([
    {
      id: '1',
      name: 'First Steps',
      description: 'Completed your first activity',
      emoji: '👣',
      mintDate: '2024-01-15',
      tokenId: '001',
      rarity: 'common',
      ipfsUrl: 'ipfs://QmFirstSteps123'
    },
    {
      id: '2',
      name: 'Speed Demon',
      description: 'Ran 10km in under 45 minutes',
      emoji: '⚡',
      mintDate: '2024-01-20',
      tokenId: '002',
      rarity: 'rare',
      ipfsUrl: 'ipfs://QmSpeedDemon456'
    },
    {
      id: '3',
      name: 'Consistency King',
      description: 'Logged activities for 7 consecutive days',
      emoji: '👑',
      mintDate: '2024-01-25',
      tokenId: '003',
      rarity: 'rare',
      ipfsUrl: 'ipfs://QmConsistency789'
    },
    {
      id: '4',
      name: 'Cosmic Explorer',
      description: 'Completed 50 total activities',
      emoji: '🚀',
      mintDate: '2024-02-01',
      tokenId: '004',
      rarity: 'legendary',
      ipfsUrl: 'ipfs://QmCosmicExplorer101'
    },
  ]);

  const [pendingRewards] = useState([
    {
      id: '1',
      type: 'token',
      title: 'Weekly Challenge Complete',
      description: 'You completed 5 activities this week',
      amount: 100,
      earnedDate: '2024-01-30'
    },
    {
      id: '2',
      type: 'badge',
      title: 'Marathon Master',
      description: 'Ran a total distance of 42km',
      amount: 0,
      earnedDate: '2024-01-28'
    },
  ]);

  const [leaderboard] = useState([
    {
      id: '1',
      address: '0x1234567890123456789012345678901234567890',
      ensName: 'cosmicrunner.eth',
      activities: 87,
      tokens: 4350,
      badges: 12,
      isCurrentUser: false
    },
    {
      id: '2',
      address: '0x2345678901234567890123456789012345678901',
      ensName: 'fitnessguru.eth',
      activities: 76,
      tokens: 3820,
      badges: 10,
      isCurrentUser: false
    },
    {
      id: '3',
      address: '0x3456789012345678901234567890123456789012',
      ensName: null,
      activities: 65,
      tokens: 3250,
      badges: 9,
      isCurrentUser: false
    },
    {
      id: '4',
      address: '0x4567890123456789012345678901234567890123',
      ensName: null,
      activities: 45,
      tokens: 2250,
      badges: 7,
      isCurrentUser: true
    },
    {
      id: '5',
      address: '0x5678901234567890123456789012345678901234',
      ensName: 'stardust.eth',
      activities: 38,
      tokens: 1900,
      badges: 6,
      isCurrentUser: false
    },
  ]);

  return {
    tokenBalance,
    badges,
    activitiesCount,
    pendingRewards,
    leaderboard,
  };
};