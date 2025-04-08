// src/components/Partenaires.jsx
import React from 'react';
import { theme } from '../styles/theme';

const Partenaires = () => {
  const partenaires = [
    {
      id: 1,
      name: "Éditions Gallimard",
      logo: "logo-gallimard.svg"
    },
    {
      id: 2,
      name: "Ministère de la Culture",
      logo: "logo-culture.svg"
    },
    {
      id: 3,
      name: "Université Paris-Sorbonne",
      logo: "logo-sorbonne.svg"
    },
    {
      id: 4,
      name: "Fnac",
      logo: "logo-fnac.svg"
    },
    {
      id: 5,
      name: "Association des Bibliothécaires de France",
      logo: "logo-abf.svg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-orange-500 to-blue-800"></div>
          </div>
        <h2 className="text-3xl font-bold text-center mb-12 text-secondary">Nos Partenaires</h2>
        
        <div className="flex flex-wrap justify-center items-center gap-12">
          {partenaires.map((partenaire) => (
            <div key={partenaire.id} className="w-40 h-40 bg-white rounded-lg shadow-md flex items-center justify-center p-4 hover:shadow-lg transition-shadow">
              <div className="text-center">
                {/* Placeholder for partner logo */}
                <div className="w-20 h-20 mx-auto bg-gray-200 rounded-full mb-3 flex items-center justify-center">
                  <span className="text-sm text-gray-600">Logo</span>
                </div>
                <p className="text-sm text-gray-700 font-medium">{partenaire.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-md p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-secondary mb-4">Devenez Partenaire</h3>
          <p className="text-gray-600 mb-6">
            Rejoignez notre réseau de partenaires et contribuez au rayonnement de la culture et de la connaissance dans notre communauté.
          </p>
          <div className="flex justify-center">
            <a 
              href="/partenariat" 
              className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partenaires;