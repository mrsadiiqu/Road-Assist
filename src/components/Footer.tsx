import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' }
];

const contactInfo = [
  { icon: Phone, text: '1-800-ROADHELP', href: 'tel:1-800-ROADHELP' },
  { icon: Mail, text: 'help@roadassist.com', href: 'mailto:help@roadassist.com' },
  { icon: MapPin, text: 'Available Nationwide' }
];

const quickLinks = [
  { name: 'Services', href: '/#services' },
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'About Us', href: '/#about' },
  { name: 'Contact', href: '/#contact' },
  { name: 'Terms of Service', href: '/terms' },
  { name: 'Privacy Policy', href: '/privacy' }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-primary-400 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <Car className="relative h-8 w-8 text-primary-400 transform group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-xl font-bold text-white">RoadAssist</span>
            </Link>
            <p className="text-sm text-gray-400">
              Your trusted partner for 24/7 roadside assistance. Professional service when you need it most.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-colors duration-300 block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index} className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-primary-400" />
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                      >
                        {info.text}
                      </a>
                    ) : (
                      <span className="text-gray-400">{info.text}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and tips.
            </p>
            <form className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-500 text-gray-300 placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="mt-2 w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} RoadAssist. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/terms"
                className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-300"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-300"
              >
                Privacy
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-gray-400 hover:text-primary-400 transition-colors duration-300"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}