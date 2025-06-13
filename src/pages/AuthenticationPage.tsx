import React from 'react';
import AuthComponent from '../components/AuthComponent';
import heroImage from "../assets/images/home/hero_image.jpg"


const AuthenticationPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Background Image (60%) */}
      <div className="hidden md:block w-3/5 relative bg-blue-500 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-purple-200">
          {/* You can use your own image here */}
          <img 
            src={heroImage}
            alt="Inspirational background" 
            className="object-cover w-full h-full opacity-90"
          />
          <div className="absolute bottom-4 left-4 text-white text-xs opacity-70">
            Image of Biblio ENSPY
          </div>
        </div>
      </div>

      {/* Right side - Authentication Form (40%) */}
      <div className="w-full md:w-2/5 flex flex-col p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-[#ff8c00] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
            <span className="font-bold text-[#1b263b]">Biblio ENSPY </span>
          </div>
        </div>

        

        {/* Authentication Component */}
        
          <AuthComponent />

        {/* Footer */}
        <div className="text-center py-4 text-sm text-gray-500 mt-auto">
          <p>© {new Date().getFullYear()} BiblioENSPY . Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPage;