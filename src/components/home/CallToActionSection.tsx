import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../../contexts/ConfigContext.tsx';

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const CallToActionSection: React.FC = () => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    const handleMouseEnter = (
        e: React.MouseEvent<HTMLAnchorElement>,
        isSecondary: boolean = false
    ) => {
        if (isSecondary) {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = secondaryColor;
        } else {
            e.currentTarget.style.backgroundColor = primaryColor;
            e.currentTarget.style.color = 'white';
        }
    };

    const handleMouseLeave = (
        e: React.MouseEvent<HTMLAnchorElement>,
        isSecondary: boolean = false
    ) => {
        if (isSecondary) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'white';
        } else {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = secondaryColor;
        }
    };

    return (
        <section className="py-20 relative overflow-hidden">
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `linear-gradient(120deg, ${secondaryColor} 0%, ${primaryColor} 100%)`
                }}
            />

            {/* Formes décoratives */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full transform -translate-x-1/3 translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="max-w-3xl mx-auto text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <h2 className="text-4xl font-bold mb-6 text-white">
                        Rejoignez notre communauté
                    </h2>
                    <p className="text-xl text-white/90 mb-10 leading-relaxed">
                        Créez un compte aujourd'hui et profitez de tous nos services pour explorer,
                        emprunter et découvrir notre vaste collection.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <motion.a
                            href="/auth"
                            className="bg-white font-medium py-4 px-8 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                            style={{ color: secondaryColor }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={(e) => handleMouseEnter(e, false)}
                            onMouseLeave={(e) => handleMouseLeave(e, false)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                            </svg>
                            S'inscrire
                        </motion.a>

                        <motion.a
                            href="/catalogue"
                            className="bg-transparent border-2 border-white text-white py-4 px-8 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onMouseEnter={(e) => handleMouseEnter(e, true)}
                            onMouseLeave={(e) => handleMouseLeave(e, true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            Explorer le catalogue
                        </motion.a>
                    </div>

                    <div className="mt-12 pt-12 border-t border-white/20">
                        <p className="text-white/80 text-sm mb-4">
                            Rejoignez les milliers de membres qui nous font confiance
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="bg-white/10 py-2 px-4 rounded-lg">
                                <span className="text-white text-sm font-medium">Inscription rapide</span>
                            </div>
                            <div className="bg-white/10 py-2 px-4 rounded-lg">
                                <span className="text-white text-sm font-medium">Accès illimité</span>
                            </div>
                            <div className="bg-white/10 py-2 px-4 rounded-lg">
                                <span className="text-white text-sm font-medium">Assistance 7j/7</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CallToActionSection;
