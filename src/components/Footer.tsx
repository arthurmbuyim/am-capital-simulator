'use client';

import { Building, Mail, Phone, MapPin, ArrowRight, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-am-navy text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2"  id='contact'>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">A&M Capital</h3>
                <p className="text-gray-400 text-sm">Investissement Immobilier</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md">
              Spécialiste de l'investissement locatif, nous accompagnons nos clients 
              dans la maximisation de leurs rendements immobiliers grâce à des analyses 
              précises et des données de marché en temps réel.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="w-4 h-4 text-[#e90]" />
                <span className="text-sm">20 Rue Ampère, 91300 Massy</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="w-4 h-4 text-[#e90]" />
                <span className="text-sm">+33 1 42 86 83 85</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="w-4 h-4 text-[#e90]" />
                <span className="text-sm">contact@am-capital.fr</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Conseil en investissement
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Gestion locative
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Accompagnement fiscal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Financement immobilier
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Optimisation Airbnb
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Guide de l'investisseur
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Analyses de marché
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Calculateurs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  Blog immobilier
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e90] transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md">
            <h4 className="text-lg font-semibold mb-4">
              Restez informé des opportunités
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Recevez nos analyses exclusives et les meilleures opportunités d'investissement.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 hover:text-[#e90] px-4 py-2 rounded-lg transition-colors flex items-center">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2025 A&M Capital. Tous droits réservés.
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[#e90] transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-[#e90] transition-colors">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-[#e90] transition-colors">
                CGU
              </a>
              <a href="#" className="hover:text-[#e90] transition-colors">
                RGPD
              </a>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/a-m-capital1/?viewAsMember=true"
                className="text-gray-400 hover:text-[#e90] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/am.capital.fr"
                className="text-gray-400 hover:text-[#e90] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à investir intelligemment ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez plus de 10,000 investisseurs qui utilisent A&M Capital
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg">
              Commencer maintenant
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors">
              Planifier un appel
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;