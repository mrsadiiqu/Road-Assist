import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Wrench, 
  Battery, 
  Fuel, 
  Settings, 
  Lock, 
  PhoneCall 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    name: 'Towing Service',
    description: 'Professional towing service for all types of vehicles, available 24/7.',
    icon: Car,
    color: 'bg-blue-500'
  },
  {
    name: 'Battery Jump Start',
    description: 'Quick and reliable battery jump start service to get you back on the road.',
    icon: Battery,
    color: 'bg-yellow-500'
  },
  {
    name: 'Fuel Delivery',
    description: 'Emergency fuel delivery service when you run out of gas.',
    icon: Fuel,
    color: 'bg-green-500'
  },
  {
    name: 'Tire Change',
    description: 'Professional tire change service for flat tires.',
    icon: Settings,
    color: 'bg-red-500'
  },
  {
    name: 'Lockout Service',
    description: 'Help when you\'re locked out of your vehicle.',
    icon: Lock,
    color: 'bg-purple-500'
  },
  {
    name: 'Mechanical Assistance',
    description: 'Basic mechanical assistance for minor vehicle issues.',
    icon: Wrench,
    color: 'bg-orange-500'
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

export default function Services() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional roadside assistance services available 24/7 to get you back on the road quickly and safely.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className={`${service.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {service.description}
                  </p>
                  <Link
                    to="/dashboard/request"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Request Service
                    <PhoneCall className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Need Emergency Assistance?
          </h2>
          <Link
            to="/dashboard/request"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PhoneCall className="mr-2 h-5 w-5" />
            Get Help Now
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 