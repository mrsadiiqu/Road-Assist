import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    value: '1-800-ROADHELP',
    link: 'tel:1-800-ROADHELP',
    color: 'bg-blue-500'
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'help@roadassist.com',
    link: 'mailto:help@roadassist.com',
    color: 'bg-green-500'
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'Available nationwide, 24/7',
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

export default function Contact() {
  return (
    <section id="contact" className="relative py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/30 to-white"></div>
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
            Contact Us
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            We're here to help 24/7
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              {contactInfo.map((info, index) => {
                const IconComponent = info.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="group"
                  >
                    <div className="flex items-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className={`flex-shrink-0 h-12 w-12 ${info.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="mt-1 text-lg text-gray-600 hover:text-primary-600 transition-colors duration-300"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-lg text-gray-600">{info.value}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors duration-200"
                    placeholder="Tell us about your situation..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}