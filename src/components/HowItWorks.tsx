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
    description: 'Call our emergency hotline or use our app to request assistance.',
    icon: PhoneCall,
    color: 'bg-blue-500'
  },
  {
    title: 'Share Location',
    description: 'Provide your current location and vehicle details.',
    icon: MapPin,
    color: 'bg-green-500'
  },
  {
    title: 'Wait for Arrival',
    description: 'Our service provider will be dispatched to your location.',
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
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Simple steps to get you back on the road
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className={`${step.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link
            to="/dashboard/request"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Request Service
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}