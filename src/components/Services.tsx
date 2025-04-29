import React from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Wrench, 
  Battery, 
  Fuel, 
  Settings, 
  Lock, 
  PhoneCall,
  Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { SERVICE_FEES, BASE_FEE, DISTANCE_RATE, PEAK_HOUR_SURCHARGE } from '../lib/utils/pricing';

const services = [
  {
    id: 'towing',
    name: 'Towing Service',
    description: 'Professional towing service for all types of vehicles, available 24/7.',
    icon: Car,
    color: 'bg-blue-500'
  },
  {
    id: 'battery',
    name: 'Battery Jump Start',
    description: 'Quick and reliable battery jump start service to get you back on the road.',
    icon: Battery,
    color: 'bg-yellow-500'
  },
  {
    id: 'fuel',
    name: 'Fuel Delivery',
    description: 'Emergency fuel delivery service when you run out of gas.',
    icon: Fuel,
    color: 'bg-green-500'
  },
  {
    id: 'tire',
    name: 'Tire Change',
    description: 'Professional tire change service for flat tires.',
    icon: Settings,
    color: 'bg-red-500'
  },
  {
    id: 'lockout',
    name: 'Lockout Service',
    description: 'Help when you\'re locked out of your vehicle.',
    icon: Lock,
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

export default function Services() {
  return (
    <>
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Our Services
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Professional roadside assistance services available 24/7
            </p>
          </motion.div>

          <div className="mb-12 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-primary-600" />
              Pricing Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Base Pricing</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>Base Fee: ₦{BASE_FEE.toLocaleString()} (first 5km)</li>
                  <li>Additional Distance: ₦{DISTANCE_RATE.toLocaleString()} per km</li>
                  <li>Peak Hour Surcharge: {PEAK_HOUR_SURCHARGE * 100}%</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Service Fees</h4>
                <ul className="space-y-2 text-gray-600">
                  {Object.entries(SERVICE_FEES).map(([service, fee]) => (
                    <li key={service}>
                      {service.charAt(0).toUpperCase() + service.slice(1)}: ₦{fee.toLocaleString()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              * Peak hours: Weekdays 7-9 AM and 5-7 PM
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              const serviceFee = SERVICE_FEES[service.id as keyof typeof SERVICE_FEES];
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
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        Service Fee: ₦{serviceFee.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        + Base Fee: ₦{BASE_FEE.toLocaleString()}
                      </p>
                    </div>
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
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
      </section>
      <Footer/>
    </>
  );
}