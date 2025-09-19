import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMockData } from '../hooks/useMockData';
import { GiftIcon, SparklesIcon, CurrencyDollarIcon, TrophyIcon } from '@heroicons/react/24/outline';

const ClaimRewards: React.FC = () => {
  const { pendingRewards } = useMockData();
  const [claiming, setClaiming] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<string[]>([]);

  const handleClaim = async (rewardId: string) => {
    setClaiming(rewardId);
    
    // Mock blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setClaimed([...claimed, rewardId]);
    setClaiming(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <GiftIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">Claim Rewards</h1>
        <p className="text-gray-300">Your cosmic achievements await</p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6"
      >
        {pendingRewards.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-600/30 text-center"
          >
            <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Pending Rewards</h3>
            <p className="text-gray-400">Complete more activities to earn rewards!</p>
          </motion.div>
        ) : (
          pendingRewards.map((reward) => (
            <motion.div
              key={reward.id}
              variants={itemVariants}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                    {reward.type === 'token' ? (
                      <CurrencyDollarIcon className="w-8 h-8 text-white" />
                    ) : (
                      <TrophyIcon className="w-8 h-8 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">{reward.title}</h3>
                    <p className="text-gray-300 mb-2">{reward.description}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-purple-300">
                        {reward.type === 'token' ? `+${reward.amount} FITT` : 'NFT Badge'}
                      </span>
                      <span className="text-gray-400">Earned: {reward.earnedDate}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClaim(reward.id)}
                  disabled={claiming === reward.id || claimed.includes(reward.id)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                    claimed.includes(reward.id)
                      ? 'bg-green-600/20 text-green-300 border border-green-500/30 cursor-not-allowed'
                      : claiming === reward.id
                      ? 'bg-gray-600/20 text-gray-300 border border-gray-500/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
                  }`}
                >
                  {claimed.includes(reward.id)
                    ? 'Claimed ✓'
                    : claiming === reward.id
                    ? 'Claiming...'
                    : 'Claim Reward'
                  }
                </motion.button>
              </div>

              {claimed.includes(reward.id) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-green-600/10 border border-green-500/30 rounded-xl"
                >
                  <p className="text-green-300 text-sm">
                    🎉 Reward claimed successfully! 
                    <a 
                      href="#" 
                      className="ml-2 underline hover:text-green-200"
                    >
                      View on Explorer
                    </a>
                  </p>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        variants={itemVariants}
        className="mt-8 grid md:grid-cols-2 gap-6"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <CurrencyDollarIcon className="w-8 h-8 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Total Tokens Earned</h3>
          </div>
          <p className="text-3xl font-bold text-blue-300">
            {pendingRewards.filter(r => r.type === 'token').reduce((sum, r) => sum + r.amount, 0)} FITT
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrophyIcon className="w-8 h-8 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Badges Available</h3>
          </div>
          <p className="text-3xl font-bold text-purple-300">
            {pendingRewards.filter(r => r.type === 'badge').length}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClaimRewards;