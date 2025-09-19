import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import ClaimRewards from './pages/ClaimRewards';
import Leaderboard from './pages/Leaderboard';
import MyBadges from './pages/MyBadges';
import { WalletProvider } from './providers/WalletProvider';
import { AuthProvider } from './providers/AuthProvider';
import CosmicBackground from './components/CosmicBackground';

function App() {
  return (
    <WalletProvider>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 relative overflow-hidden">
          <CosmicBackground />
          <Router>
            <Layout>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/log-activity" element={<LogActivity />} />
                  <Route path="/claim-rewards" element={<ClaimRewards />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/my-badges" element={<MyBadges />} />
                </Routes>
              </motion.div>
            </Layout>
          </Router>
        </div>
      </AuthProvider>
    </WalletProvider>
  );
}

export default App;