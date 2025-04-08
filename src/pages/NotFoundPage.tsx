import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-orange-50 rounded-xl shadow-md overflow-hidden">
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-6">
                Votre bibliothèque en ligne
              </h1>
              <p className="text-lg mb-8 text-gray-700">
                Accédez à des milliers de livres, réservez en quelques clics et empruntez facilement depuis votre espace étudiant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/books" 
                  className="bg-[#ff8c00] hover:bg-orange-600 text-white py-3 px-6 rounded-md font-medium text-center"
                >
                  Parcourir le catalogue
                </Link>
                <Link 
                  to="/login" 
                  className="bg-white hover:bg-gray-100 text-orange-500 border border-orange-500 py-3 px-6 rounded-md font-medium text-center"
                >
                  Se connecter
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="aspect-w-16 aspect-h-9 bg-orange-200 rounded-lg relative overflow-hidden">
                {/* Placeholder pour une image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-orange-600 text-lg font-medium">Image de la bibliothèque</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Features Section */}
      <section>
        <div className="container mx-auto px-6 py-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nos services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Catalogue complet</h3>
              <p className="text-gray-600 text-center">
                Accédez à notre vaste collection de livres académiques et de loisirs.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Réservation simple</h3>
              <p className="text-gray-600 text-center">
                Réservez vos livres en quelques clics et récupérez-les quand vous le souhaitez.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-4 text-gray-800">Espace personnel</h3>
              <p className="text-gray-600 text-center">
                Suivez vos emprunts, gérez vos réservations et consultez votre historique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Books Section */}
      <section className="bg-orange-50 py-12 rounded-xl">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Dernières acquisitions</h2>
            <Link to="/books" className="text-orange-500 hover:underline font-medium">
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((book) => (
              <div key={book} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-3 aspect-h-4 bg-orange-200">
                  <div className="flex items-center justify-center">
                    <span className="text-orange-600">Image livre {book}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Titre du livre {book}</h3>
                  <p className="text-sm text-gray-600 mb-3">Auteur du livre</p>
                  <Link 
                    to={`/books/${book}`}
                    className="block w-full bg-[#ff8c00] hover:bg-orange-600 text-white py-2 rounded text-center"
                  >
                    Voir détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;