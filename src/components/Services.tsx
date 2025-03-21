import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Battery, Car, Fuel, Key, PenTool as Tools } from 'lucide-react';

const services = [
  {
    title: 'Towing Service',
    description: '24/7 towing service for all vehicle types, from cars to heavy-duty trucks.',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1515876305430-f06edab8282a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  },
  {
    title: 'Battery Jump Start',
    description: 'Quick battery jump-start service to get you back on the road.',
    icon: Battery,
    image: 'https://images.unsplash.com/photo-1517026575980-3e1e2dedeab4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  },
  {
    title: 'Tire Change',
    description: 'Professional tire change and repair service available anywhere.',
    icon: Tools,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  },
  {
    title: 'Fuel Delivery',
    description: 'Run out of gas? We\'ll bring fuel right to your location.',
    icon: Fuel,
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  },
  {
    title: 'Lockout Service',
    description: 'Locked your keys in the car? We\'ve got you covered.',
    icon: Key,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  },
  {
    title: 'General Repairs',
    description: 'On-site mechanical repairs for common breakdown issues.',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
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
    <section id="services" className="relative py-20 bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/30 to-white"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2 
            className="text-3xl font-extrabold text-gray-900 sm:text-4xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Our Services
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-600"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Professional roadside assistance services available 24/7
          </motion.p>
        </div>

        <motion.div 
          className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-12 w-12 bg-primary-500/90 backdrop-blur-sm rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary-200 transition-colors duration-300">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{service.description}</p>
                  <div className="mt-4">
                    <button className="inline-flex items-center text-primary-600 hover:text-primary-500 font-medium">
                      Learn more
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}