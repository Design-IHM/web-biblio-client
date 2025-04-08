import React, { useEffect, useState } from 'react';
import AuthComponent from '../components/AuthComponent';

const AuthenticationPage = () => {

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-gray-50">
      {/* App Logo - visible on larger screens */}
      { (
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <div className="h-10 w-10 rounded-full bg-[#ff8c00] flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <span className="font-bold text-[#1b263b]">ENSPY Bibliothèque</span>
        </div>
      )}

      { <AuthComponent />}

      {/* Footer */}
      <div className="text-center py-4 text-sm text-gray-500">
        <p>© {new Date().getFullYear()} ENSPY Bibliothèque. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default AuthenticationPage;