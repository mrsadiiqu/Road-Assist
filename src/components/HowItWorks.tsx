import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, MapPin, Clock, CreditCard } from 'lucide-react';

const steps = [
  {
    title: 'Request Service',
    description: 'Call us or use our app to request immediate assistance.',
    icon: PhoneCall,
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Share Location',
    description: 'Share your location or describe where you are.',
    icon: MapPin,
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Quick Response',
    description: 'Our nearest professional will arrive within 30 minutes.',
    icon: Clock,
    color: 'from-amber-500 to-amber-600'
  },
  {
    title: 'Easy Payment',
    description: 'Pay securely through our platform after service completion.',
    icon: CreditCard,
    color: 'from-purple-500 to-purple-600'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
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
    <section id="how-it-works" className="relative py-20 overflow-hidden bg-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50/50"></div>
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-primary-50/50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Get back on the road in four simple steps
          </p>
        </motion.div>

        <motion.div
          className="mt-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="relative">
            {/* Connection line */}
            <div 
              className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200"
              style={{ width: '100%' }}
            />

            {/* Steps */}
            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative text-center group"
                  >
                    <div className="relative">
                      <motion.div
                        className={`relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${step.color} 
                          shadow-lg group-hover:shadow-xl transition-shadow duration-300
                          before:absolute before:inset-0 before:bg-white before:rounded-2xl before:transform 
                          before:scale-0 before:opacity-0 before:transition-transform before:duration-300 
                          group-hover:before:scale-90 group-hover:before:opacity-10`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <IconComponent className="relative w-10 h-10 text-white transform translate-x-5 translate-y-5" />
                      </motion.div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                          <span className="text-primary-600 font-bold">{index + 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8 space-y-3">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition-transform duration-200 hover:scale-105">
            Get Started Now
            <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}