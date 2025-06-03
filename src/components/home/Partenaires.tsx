import { useConfig } from '../../contexts/ConfigContext.tsx';
import LoadingSpinner from '../common/LoadingSpinner';

const Partenaires = () => {
    const { orgSettings, isLoading } = useConfig();

    // Configuration des couleurs depuis Firebase
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';
    const organizationName = orgSettings?.Name || 'BiblioENSPY';
    const orgEmail = orgSettings?.Contact?.Email || 'contact@biblioenspy.com';

    // Affichage du loader pendant le chargement
    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 flex justify-center">
                    <LoadingSpinner size="lg" text="Chargement des partenaires..." />
                </div>
            </section>
        );
    }

    const partenaires = [
        {
            id: 1,
            name: "Ministère de l'Éducation",
            description: "Partenaire institutionnel pour l'éducation",
            logo: "🏛️",
            color: secondaryColor
        },
        {
            id: 2,
            name: "Éditions Locales",
            description: "Fournisseur de contenus littéraires",
            logo: "📚",
            color: primaryColor
        },
        {
            id: 3,
            name: "Université Partenaire",
            description: "Collaboration académique et recherche",
            logo: "🎓",
            color: secondaryColor
        },
        {
            id: 4,
            name: "Fondation Culturelle",
            description: "Promotion de la culture et des arts",
            logo: "🎭",
            color: primaryColor
        },
        {
            id: 5,
            name: "Tech Partners",
            description: "Solutions technologiques innovantes",
            logo: "💻",
            color: secondaryColor
        },
        {
            id: 6,
            name: "Communauté Locale",
            description: "Engagement communautaire",
            logo: "🤝",
            color: primaryColor
        }
    ];

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    {/* Élément décoratif */}
                    <div className="flex justify-center mb-4">
                        <div
                            className="w-16 h-1 rounded-full"
                            style={{
                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                            }}
                        ></div>
                    </div>

                    <h2
                        className="text-3xl font-bold mb-4"
                        style={{ color: secondaryColor }}
                    >
                        Nos Partenaires
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {organizationName} collabore avec des institutions et organisations de confiance
                        pour enrichir notre offre de services et soutenir notre mission éducative.
                    </p>
                </div>

                {/* Grille des partenaires */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {partenaires.map((partenaire) => (
                        <div
                            key={partenaire.id}
                            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
                            style={{
                                border: `2px solid transparent`,
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = partenaire.color;
                                e.currentTarget.style.boxShadow = `0 10px 25px -5px ${partenaire.color}30`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'transparent';
                                e.currentTarget.style.boxShadow = '';
                            }}
                        >
                            <div className="p-6 text-center">
                                {/* Logo/Icône du partenaire */}
                                <div
                                    className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110"
                                    style={{
                                        backgroundColor: `${partenaire.color}15`,
                                        border: `2px solid ${partenaire.color}30`
                                    }}
                                >
                                    <span>{partenaire.logo}</span>
                                </div>

                                {/* Nom du partenaire */}
                                <h3
                                    className="text-lg font-bold mb-2 transition-colors duration-300"
                                    style={{ color: partenaire.color }}
                                >
                                    {partenaire.name}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                    {partenaire.description}
                                </p>

                                {/* Indicateur de collaboration */}
                                <div
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                                    style={{
                                        backgroundColor: `${partenaire.color}10`,
                                        color: partenaire.color
                                    }}
                                >
                                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: partenaire.color }}></span>
                                    Partenaire actif
                                </div>
                            </div>

                            {/* Effet de hover */}
                            <div
                                className="h-1 w-0 group-hover:w-full transition-all duration-300"
                                style={{ backgroundColor: partenaire.color }}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Section Devenez Partenaire */}
                <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto relative overflow-hidden">
                    {/* Background décoratif */}
                    <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 transform translate-x-1/2 -translate-y-1/2"
                        style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div
                        className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-10 transform -translate-x-1/2 translate-y-1/2"
                        style={{ backgroundColor: secondaryColor }}
                    ></div>

                    <div className="relative z-10">
                        <div className="text-center mb-6">
                            <div
                                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                                style={{ backgroundColor: `${primaryColor}15` }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke={primaryColor}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>

                            <h3
                                className="text-2xl font-bold mb-4"
                                style={{ color: secondaryColor }}
                            >
                                Devenez Partenaire de {organizationName}
                            </h3>

                            <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                                Rejoignez notre réseau de partenaires et contribuez au rayonnement de la culture
                                et de la connaissance dans notre communauté. Ensemble, nous pouvons faire la différence.
                            </p>
                        </div>

                        {/* Avantages du partenariat */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <div
                                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${primaryColor}15` }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={primaryColor}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold mb-2" style={{ color: secondaryColor }}>Visibilité</h4>
                                <p className="text-sm text-gray-600">Augmentez votre visibilité auprès de notre communauté</p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${secondaryColor}15` }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={secondaryColor}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold mb-2" style={{ color: secondaryColor }}>Réseau</h4>
                                <p className="text-sm text-gray-600">Développez votre réseau professionnel et académique</p>
                            </div>

                            <div className="text-center">
                                <div
                                    className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${primaryColor}15` }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={primaryColor}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold mb-2" style={{ color: secondaryColor }}>Impact</h4>
                                <p className="text-sm text-gray-600">Participez à une mission éducative et culturelle</p>
                            </div>
                        </div>

                        {/* Bouton contact */}
                        <div className="text-center">
                            <a
                                href={`mailto:${orgEmail}`}
                                className="inline-flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                style={{
                                    backgroundColor: primaryColor,
                                    color: 'white'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = secondaryColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = primaryColor;
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Nous contacter
                            </a>

                            <p className="text-sm text-gray-500 mt-4">
                                Envoyez-nous un email à{' '}
                                <a
                                    href={`mailto:${orgEmail}`}
                                    className="font-medium hover:underline"
                                    style={{ color: primaryColor }}
                                >
                                    {orgEmail}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistiques de partenariats */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { number: '25+', label: 'Partenaires actifs', icon: '🤝' },
                        { number: '15', label: 'Projets collaboratifs', icon: '📋' },
                        { number: '5000+', label: 'Bénéficiaires', icon: '👥' },
                        { number: '3', label: 'Années d\'expérience', icon: '⭐' }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div
                                className="text-2xl font-bold mb-1"
                                style={{ color: index % 2 === 0 ? primaryColor : secondaryColor }}
                            >
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partenaires;
