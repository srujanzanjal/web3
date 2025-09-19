import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import { PlusCircleIcon, CalendarIcon, ClockIcon, MapIcon } from '@heroicons/react/24/outline';

const LogActivity: React.FC = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [formData, setFormData] = useState({
    activityType: '',
    distance: '',
    duration: '',
    date: new Date().toISOString().split('T')[0],
  });

  const activityTypes = [
    { value: 'run', label: 'Run', emoji: '🏃‍♂️' },
    { value: 'walk', label: 'Walk', emoji: '🚶‍♂️' },
    { value: 'cycle', label: 'Cycle', emoji: '🚴‍♂️' },
    { value: 'swim', label: 'Swim', emoji: '🏊‍♂️' },
    { value: 'pushups', label: 'Push-ups', emoji: '💪' },
    { value: 'yoga', label: 'Yoga', emoji: '🧘‍♀️' },
    { value: 'weightlifting', label: 'Weight Lifting', emoji: '🏋️‍♂️' },
    { value: 'stretching', label: 'Stretching', emoji: '🤸‍♂️' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      navigate('/');
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {showConfetti && <Confetti recycle={false} />}
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <PlusCircleIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Log Activity</h1>
            <p className="text-gray-300">Record your cosmic fitness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Activity Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Activity Type
              </label>
              <select
                name="activityType"
                value={formData.activityType}
                onChange={handleChange}
                required
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select an activity</option>
                {activityTypes.map((activity) => (
                  <option key={activity.value} value={activity.value}>
                    {activity.emoji} {activity.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Distance/Duration Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapIcon className="w-4 h-4 inline mr-1" />
                  Distance (km) / Reps
                </label>
                <input
                  type="number"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  placeholder="e.g., 5.2 or 50"
                  step="0.1"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <ClockIcon className="w-4 h-4 inline mr-1" />
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <CalendarIcon className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg"
            >
              Log Activity & Earn Rewards
            </motion.button>
          </form>

          {showConfetti && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded-2xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🏆
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">Activity Logged!</h3>
                <p className="text-purple-300">+50 FITT tokens earned</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LogActivity;