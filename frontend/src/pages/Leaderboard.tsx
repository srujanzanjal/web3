import React from 'react';
import { motion } from 'framer-motion';
import { useApiData } from '../hooks/useApiData';
import { TrophyIcon, FireIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';

const Leaderboard: React.FC = () => {
  const { leaderboard, loading, error } = useApiData();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-600 to-amber-800';
      default:
        return 'from-purple-500 to-blue-500';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <TrophyIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">Cosmic Leaderboard</h1>
        <p className="text-gray-300">The most dedicated fitness explorers</p>
      </div>

      {/* Top 3 Podium */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        {leaderboard.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.id}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border relative overflow-hidden ${
              index === 0 
                ? 'border-yellow-500/50 md:order-2' 
                : index === 1 
                ? 'border-gray-400/50 md:order-1' 
                : 'border-amber-600/50 md:order-3'
            }`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${
              index === 0 ? 'bg-yellow-500/10' : index === 1 ? 'bg-gray-400/10' : 'bg-amber-600/10'
            }`} />
            
            <div className="relative z-10 text-center">
              <div className="text-4xl mb-2">{getRankIcon(index + 1)}</div>
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {user.ensName || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-1">
                  <FireIcon className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">{user.activities} activities</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <SparklesIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300">{user.tokens} FITT</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <TrophyIcon className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">{user.badges} badges</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full Leaderboard Table */}
      <motion.div
        variants={itemVariants}
        className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/20 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">User</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Activities</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Tokens</th>
                <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <motion.tr
                  key={user.id}
                  variants={itemVariants}
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  className={`border-b border-gray-700/50 transition-colors ${
                    user.isCurrentUser ? 'bg-purple-600/10' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{getRankIcon(index + 1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getRankColor(index + 1)} rounded-full flex items-center justify-center`}>
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user.ensName || `${user.address.slice(0, 8)}...${user.address.slice(-6)}`}
                        </div>
                        {user.isCurrentUser && (
                          <div className="text-purple-400 text-xs font-medium">You</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <FireIcon className="w-4 h-4 text-orange-400" />
                      <span className="text-white font-medium">{user.activities}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <SparklesIcon className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">{user.tokens}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <TrophyIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">{user.badges}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Leaderboard;