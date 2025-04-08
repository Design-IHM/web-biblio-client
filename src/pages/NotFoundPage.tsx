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
                ERREUR 404
              </h1>
              <p className="text-lg mb-8 text-gray-700">Page Not Found              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/" 
                  className="bg-[#ff8c00] hover:bg-orange-600 text-white py-3 px-6 rounded-md font-medium text-center"
                >
                  Home
                </Link>
                
              </div>
            </div>  
        </div>
        </div>

      </section>
    </div>
  );
};

export default NotFoundPage;