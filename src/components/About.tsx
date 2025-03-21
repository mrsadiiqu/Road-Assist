import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, Award } from 'lucide-react';

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
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function About() {
  return (
    <section id="about" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary-50 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              About RoadAssist
            </h2>
            <motion.p
              className="mt-6 text-lg text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              With over 10 years of experience, RoadAssist has been providing reliable roadside assistance to drivers across the nation. Our commitment to excellence and customer satisfaction has made us the trusted choice for emergency vehicle services.
            </motion.p>
            <motion.p
              className="mt-4 text-lg text-gray-600 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              We understand that vehicle breakdowns can be stressful, which is why we strive to provide fast, professional, and friendly service to get you back on the road safely.
            </motion.p>
            
            <motion.div
              className="mt-12 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  className="w-full h-[400px] object-cover"
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                  alt="Mechanic working on a car"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:mt-0"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={feature.name}
                  variants={itemVariants}
                  className="relative group"
                >
                  <div className="flex items-center space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className={`flex-shrink-0 h-12 w-12 ${feature.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                        {feature.name}
                      </h3>
                      <p className="mt-2 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}