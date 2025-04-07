import React from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    title: 'Request Service',
    description: 'Call our emergency hotline or use our mobile app to request assistance.',
    icon: PhoneCall,
    color: 'bg-blue-500'
  },
  {
    title: 'Share Location',
    description: 'Share your current location and vehicle details with our team.',
    icon: MapPin,
    color: 'bg-green-500'
  },
  {
    title: 'Wait for Arrival',
    description: 'Our nearest service provider will be dispatched to your location.',
    icon: Clock,
    color: 'bg-yellow-500'
  },
  {
    title: 'Get Back on Road',
    description: 'Professional assistance to get you back on the road safely.',
    icon: CheckCircle,
    color: 'bg-purple-500'
  }
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

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple steps to get the help you need when you need it most.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Connection line */}
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200 hidden md:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative bg-white rounded-xl shadow-lg p-6 text-center"
                >
                  <div className={`${step.color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 hidden md:block">
                      <ArrowRight className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <Link
            to="/dashboard/request"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PhoneCall className="mr-2 h-5 w-5" />
            Request Service Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 