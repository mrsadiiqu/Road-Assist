import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import EmergencyModal from './EmergencyModal';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-primary-950 to-primary-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDQ4YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnptMC0xMmMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiMxMTY5YjEiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <motion.div 
            className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>
              <span className="block text-sm font-semibold text-primary-400 tracking-wide uppercase">
                24/7 Emergency Service
              </span>
              <span className="mt-1 block text-4xl tracking-tight font-extrabold sm:text-5xl xl:text-6xl">
                <span className="block text-white">Roadside Assistance</span>
                <span className="block text-primary-400">When You Need It</span>
              </span>
            </h1>
            <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              Fast, reliable roadside assistance available 24/7. Our professional team is ready to help you get back on the road quickly and safely, anywhere in the city.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left">
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className={cn(
                  "inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full",
                  "text-white bg-primary-500 hover:bg-primary-600",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",
                  "transform transition-transform duration-200 hover:scale-105"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PhoneCall className="w-5 h-5 mr-2" />
                Get Emergency Help
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
              <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                <img
                  className="w-full"
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                  alt="Tow truck helping a stranded vehicle"
                />
                <div className="absolute inset-0 bg-primary-900 mix-blend-multiply opacity-10"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 fill-white" viewBox="0 0 1440 74" preserveAspectRatio="none">
          <path d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 875.138 50.0141C710.527 46.3727 621.108 1.64949 456.464 0.0433865Z"></path>
        </svg>
      </div>

      {/* Emergency Modal */}
      <EmergencyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}