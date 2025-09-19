import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../providers/AuthProvider';
import { SparklesIcon, TrophyIcon, PlusCircleIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const { isConnected, connectWallet, disconnect } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: ChartBarIcon },
    { path: '/log-activity', label: 'Log Activity', icon: PlusCircleIcon },
    { path: '/leaderboard', label: 'Leaderboard', icon: TrophyIcon },
    { path: '/my-badges', label: 'My Badges', icon: StarIcon },
  ];

  return (
    <nav className="bg-gray-800/80 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <SparklesIcon className="w-8 h-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CosmicFit
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isConnected ? disconnect : connectWallet}
            className={`px-6 py-2 rounded-2xl font-semibold transition-all ${
              isConnected
                ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect Wallet'}
          </motion.button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;