import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Clock, 
  Users, 
  Award, 
  MapPin, 
  PhoneCall 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    name: '24/7 Availability',
    description: 'Round-the-clock service, because emergencies don\'t wait for business hours.',
    icon: Clock,
    color: 'bg-blue-500'
  },
  {
    name: 'Licensed Professionals',
    description: 'Fully certified and experienced roadside assistance specialists.',
    icon: Shield,
    color: 'bg-green-500'
  },
  {
    name: 'Customer Focused',
    description: 'Dedicated to providing exceptional service and support.',
    icon: Users,
    color: 'bg-purple-500'
  },
  {
    name: 'Quality Guaranteed',
    description: '100% satisfaction guarantee on all our services.',
    icon: Award,
    color: 'bg-red-500'
  }
];

const stats = [
  { label: 'Service Calls', value: '10,000+' },
  { label: 'Happy Customers', value: '9,500+' },
  { label: 'Service Providers', value: '200+' },
  { label: 'Cities Covered', value: '50+' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-6">
              About RoadAssist
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Your trusted partner for reliable roadside assistance services in Abuja and beyond.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.name}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="p-6"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-primary-600 rounded-xl p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            Need Emergency Assistance?
          </h2>
          <p className="text-primary-100 mb-6">
            Our team is ready to help you 24/7, anywhere in Abuja.
          </p>
          <Link
            to="/dashboard/request"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <PhoneCall className="mr-2 h-5 w-5" />
            Get Help Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 