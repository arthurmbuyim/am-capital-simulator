'use client';

import { Building, Shield, Award, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-am-navy">A&M Capital</h1>
              <p className="text-xs text-am-navy-light hidden sm:block">Investissement Immobilier</p>
            </div>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#simulator" className="text-am-navy-text hover:text-[#e90] transition-colors">
              Simulateur
            </a>
            <a href="#about" className="text-am-navy-text hover:text-[#e90] transition-colors">
              À propos
            </a>
            <a href="#services" className="text-am-navy-text hover:text-[#e90] transition-colors">
              Services
            </a>
            <a href="#contact" className="text-am-navy-text hover:text-[#e90] transition-colors">
              Contact
            </a>
          </nav>

          {/* Trust Badges */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">Certifié</span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700 font-medium">Expert</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu mobile"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            <a
              href="#simulator"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Simulateur
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </a>
            <a
              href="#services"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
          
          {/* Mobile Trust Badges */}
          <div className="px-4 pb-4 flex space-x-2">
            <div className="flex items-center space-x-1 bg-green-50 px-2 py-1 rounded-full text-xs">
              <Shield className="w-3 h-3 text-green-600" />
              <span className="text-green-700 font-medium">Certifié</span>
            </div>
            <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded-full text-xs">
              <Award className="w-3 h-3 text-blue-600" />
              <span className="text-blue-700 font-medium">Expert</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;