const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="bg-[#ff8c00] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">BiblioÉtudiant</h3>
              <p>
                Votre bibliothèque en ligne accessible à tout moment pour réserver et emprunter des livres.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li><a href="/books" className="hover:underline">Catalogue</a></li>
                <li><a href="/reservations" className="hover:underline">Mes réservations</a></li>
                <li><a href="/borrowings" className="hover:underline">Mes emprunts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <address className="not-italic">
                <p>Bibliothèque Universitaire</p>
                <p>45 Avenue des Études</p>
                <p>75000 Paris</p>
                <p className="mt-2">Email: contact@biblioetudiant.fr</p>
                <p>Tél: 01 23 45 67 89</p>
              </address>
            </div>
          </div>
          <div className="border-t border-orange-400 mt-6 pt-6 text-center">
            <p>&copy; {currentYear} BiblioÉtudiant. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;