import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { useMockData } from '../hooks/useMockData';
import { PlusIcon, TrophyIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { isConnected, user } = useAuth();
  const { tokenBalance, badges, activitiesCount } = useMockData();

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <SparklesIcon className="w-20 h-20 text-purple-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Welcome to CosmicFit</h2>
          <p className="text-gray-300 mb-8">Connect your wallet to start your fitness journey</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, <span className="text-purple-400">{user?.ensName || `${user?.address?.slice(0, 6)}...${user?.address?.slice(-4)}`}</span>
        </h1>
        <p className="text-gray-300">Ready to conquer the cosmos through fitness?</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <SparklesIcon className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">{tokenBalance}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">FITT Tokens</h3>
            <p className="text-gray-400 text-sm">Your cosmic currency</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl" />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <TrophyIcon className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">{badges.length}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">NFT Badges</h3>
            <p className="text-gray-400 text-sm">Achievements unlocked</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <FireIcon className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-white">{activitiesCount}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Activities</h3>
            <p className="text-gray-400 text-sm">Total logged</p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-full blur-2xl" />
        </div>
      </motion.div>

      {/* Progress Section */}
      <motion.div variants={itemVariants} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-semibold text-white mb-4">Progress to Next Badge</h3>
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>{activitiesCount} activities logged</span>
            <span>Next badge at {Math.ceil((activitiesCount + 1) / 5) * 5}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(activitiesCount % 5) * 20}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          Keep pushing! You're {5 - (activitiesCount % 5)} activities away from your next cosmic achievement.
        </p>
      </motion.div>

      {/* Recent Badges */}
      <motion.div variants={itemVariants} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Recent Badges</h3>
          <Link to="/my-badges" className="text-blue-400 hover:text-blue-300 text-sm">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.slice(0, 4).map((badge, index) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700/50 rounded-xl p-4 text-center border border-gray-600/30"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">{badge.emoji}</span>
              </div>
              <h4 className="text-white font-semibold text-sm">{badge.name}</h4>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="text-center">
        <Link to="/log-activity">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg"
          >
            <PlusIcon className="w-6 h-6" />
            <span>Log New Activity</span>
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;