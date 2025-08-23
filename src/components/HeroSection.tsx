'use client';

import { TrendingUp, Clock, Shield, ArrowDown, Play } from 'lucide-react';

const HeroSection = () => {
  const scrollToSimulator = () => {
    document.getElementById('simulator')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden">
      {/* Background Gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-slate-50"></div> */}
      
      {/* Decorative Elements */}
      {/* <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div> */}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-am-navy-text px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <div className="w-2 h-2 bg-[#e90] rounded-full animate-pulse"></div>
            <span>Données de marché en temps réel</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-am-navy-text mb-6 leading-tight">
            Maximisez vos{' '}
            <span className="bg-gradient-to-r from-[#e80] via-yellow-600 to-[#e90] bg-clip-text text-transparent">
              investissements locatifs
            </span>{' '}
            en temps réel
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Simulateur professionnel avec données de marché actualisées.{' '}
            <span className="font-semibold text-gray-800">
              Calculez instantanément votre rentabilité locative.
            </span>
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-am-navy-text font-medium">Rendements optimisés</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-am-navy-text font-medium">Calculs instantanés</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-am-navy-text font-medium">Analyses fiables</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={scrollToSimulator}
              className="group relative bg-gradient-to-r from-am-navy to-am-navy-light hover:from-am-navy hover:to-am-navy-light text-white hover:text-[#e90] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              <span className="flex items-center space-x-2">
                <span>Commencer la simulation</span>
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </span>
            </button>
            
            <button className="group flex items-center space-x-2 text-am-navy-text hover:text-[#e90] font-medium transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Play className="w-5 h-5 ml-1 "/>
              </div>
              <span>Voir la démonstration</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#e90] mb-2">10k+</div>
              <div className="text-sm text-am-navy-text">Investisseurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#e90] mb-2">€50M+</div>
              <div className="text-sm text-am-navy-text">Investis</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#e90] mb-2">27</div>
              <div className="text-sm text-am-navy-text">Villes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-[#e90] mb-2">8.5%</div>
              <div className="text-sm text-am-navy-text">Rendement moyen</div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;