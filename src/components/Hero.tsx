// src/components/Hero.jsx
import React from 'react';
import { theme } from '../styles/theme';

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1b263b] via-[#1b263b]/90 to-[#ff8c00]/80">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff8c00] opacity-10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff8c00] opacity-10 rounded-full blur-3xl transform translate-x-1/3 translate-y-1/3 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#ff8c00] opacity-5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-6">
              <span className="text-white/90 font-medium text-sm">Bienvenue dans votre bibliothèque intelligente</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Votre bibliothèque <span className="text-primary">numérique</span> de nouvelle génération
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              Découvrez une nouvelle façon d'explorer, de gérer et d'emprunter des livres avec notre système de gestion de bibliothèque moderne.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <button className="group bg-white text-secondary py-3 px-8 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary/30 flex items-center justify-center">
                Explorer le catalogue
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button className="bg-transparent border-2 border-white text-white py-3 px-8 rounded-lg font-medium hover:bg-white hover:text-secondary transition-all duration-300 shadow-lg hover:shadow-white/30 flex items-center justify-center">
                Se connecter
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="font-bold text-2xl text-white">25K+</div>
                <div className="text-white/80 text-sm">Livres</div>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="font-bold text-2xl text-white">5K+</div>
                <div className="text-white/80 text-sm">Membres</div>
              </div>
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="font-bold text-2xl text-white">24/7</div>
                <div className="text-white/80 text-sm">Accès</div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              {/* Main image with artistic design */}
              <div className="relative z-10 rounded-2xl shadow-2xl overflow-hidden border-4 border-white/20 backdrop-blur-sm transform hover:scale-105 transition-transform duration-500">
                <div className="aspect-[4/3] bg-gradient-to-br from-white/5 to-white/30 backdrop-blur-sm p-2">
                  {/* Image placeholder with modern design */}
                  <div className="w-full h-full bg-gradient-to-br from-secondary/40 to-primary/40 rounded-xl overflow-hidden relative">
                    {/* Book floating elements */}
                    <div className="absolute top-1/4 left-1/4 w-16 h-20 bg-white rounded shadow-lg transform -rotate-12 animate-float"></div>
                    <div className="absolute top-1/3 right-1/4 w-16 h-20 bg-white rounded shadow-lg transform rotate-6 animate-float" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute bottom-1/4 right-1/3 w-16 h-20 bg-white rounded shadow-lg transform -rotate-3 animate-float" style={{ animationDelay: '1s' }}></div>
                    
                    {/* Library shelves illustration */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-secondary/30 flex items-end">
                      <div className="w-full h-8 bg-secondary/50"></div>
                      <div className="absolute bottom-10 left-4 right-4 h-8 bg-secondary/40"></div>
                      <div className="absolute bottom-20 left-8 right-8 h-8 bg-secondary/30"></div>
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-2xl font-bold bg-secondary/70 px-6 py-3 rounded-lg backdrop-blur-sm shadow-lg">
                        Bibliothèque Moderne
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-20"></div>
              
              {/* Decorative dots */}
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-white rounded-full mb-3"></div>
                <div className="w-2 h-2 bg-white rounded-full mb-3"></div>
                <div className="w-2 h-2 bg-white rounded-full mb-3"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,224L60,218.7C120,213,240,203,360,186.7C480,171,600,149,720,160C840,171,960,213,1080,213.3C1200,213,1320,171,1380,149.3L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-10 h-10 rounded-full border-2 border-white/50 flex items-center justify-center cursor-pointer hover:border-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Hero;