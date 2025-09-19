import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMockData } from '../hooks/useMockData';
import { StarIcon, CalendarIcon, ArrowTopRightOnSquareIcon, XMarkIcon } from '@heroicons/react/24/outline';

const MyBadges: React.FC = () => {
  const { badges } = useMockData();
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
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
          <StarIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">My Cosmic Badges</h1>
        <p className="text-gray-300">Your achievement collection from across the fitness galaxy</p>
      </div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 text-center">
          <div className="text-3xl font-bold text-purple-300 mb-2">{badges.length}</div>
          <div className="text-gray-300">Total Badges</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20 text-center">
          <div className="text-3xl font-bold text-blue-300 mb-2">
            {badges.filter(b => b.rarity === 'rare').length}
          </div>
          <div className="text-gray-300">Rare Badges</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 text-center">
          <div className="text-3xl font-bold text-green-300 mb-2">
            {badges.filter(b => b.rarity === 'legendary').length}
          </div>
          <div className="text-gray-300">Legendary Badges</div>
        </div>
      </motion.div>

      {/* Badges Grid */}
      {badges.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-12 border border-gray-600/30 text-center"
        >
          <StarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-white mb-2">No Badges Yet</h3>
          <p className="text-gray-400 mb-6">Start logging activities to earn your first cosmic badge!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-blue-500 transition-all"
          >
            Log Your First Activity
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBadge(badge)}
              className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border cursor-pointer relative overflow-hidden ${
                badge.rarity === 'legendary' 
                  ? 'border-yellow-500/50' 
                  : badge.rarity === 'rare' 
                  ? 'border-purple-500/50' 
                  : 'border-blue-500/30'
              }`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl ${
                badge.rarity === 'legendary' 
                  ? 'bg-yellow-500/10' 
                  : badge.rarity === 'rare' 
                  ? 'bg-purple-500/10' 
                  : 'bg-blue-500/10'
              }`} />
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-2xl">
                  {badge.emoji}
                </div>
                <h3 className="text-white font-semibold mb-1">{badge.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{badge.description}</p>
                <div className="flex items-center justify-center space-x-1 text-xs">
                  <CalendarIcon className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">{badge.mintDate}</span>
                </div>
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  badge.rarity === 'legendary' 
                    ? 'bg-yellow-500/20 text-yellow-300' 
                    : badge.rarity === 'rare' 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {badge.rarity}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Badge Modal */}
      {selectedBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setSelectedBadge(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-purple-500/30 relative"
          >
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-4xl">
                {selectedBadge.emoji}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">{selectedBadge.name}</h2>
              <p className="text-gray-300 mb-4">{selectedBadge.description}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Rarity:</span>
                  <span className={`font-medium ${
                    selectedBadge.rarity === 'legendary' 
                      ? 'text-yellow-300' 
                      : selectedBadge.rarity === 'rare' 
                      ? 'text-purple-300' 
                      : 'text-blue-300'
                  }`}>
                    {selectedBadge.rarity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Minted:</span>
                  <span className="text-white">{selectedBadge.mintDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Token ID:</span>
                  <span className="text-white font-mono">{selectedBadge.tokenId}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-500 hover:to-blue-500 transition-all flex items-center justify-center space-x-2">
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  <span>View on OpenSea</span>
                </button>
                <button className="w-full bg-gray-700/50 text-gray-300 py-3 rounded-2xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center space-x-2">
                  <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                  <span>View on Etherscan</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyBadges;