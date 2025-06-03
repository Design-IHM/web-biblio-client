import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import StatItem from './StatItem.tsx';

interface StatisticData {
    number: string;
    text: string;
}

interface StatisticsSectionProps {
    statistics?: StatisticData[];
}

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const defaultStatistics: StatisticData[] = [
    { number: "25000", text: "Livres disponibles" },
    { number: "5000", text: "Membres actifs" },
    { number: "300", text: "Événements par an" },
    { number: "15", text: "Années d'expérience" }
];

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
                                                                 statistics = defaultStatistics
                                                             }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    return (
        <section className="py-20 bg-white relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                >
                    <div className="flex justify-center mb-4">
                        <div
                            className="w-16 h-1 rounded-full"
                            style={{
                                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                            }}
                        />
                    </div>
                    <span
                        className="inline-block py-1 px-3 rounded-full text-sm font-bold mb-4"
                        style={{
                            backgroundColor: `${primaryColor}10`,
                            color: primaryColor
                        }}
                    >
            Nos chiffres
          </span>
                    <h2 className="text-4xl font-bold mb-4" style={{ color: secondaryColor }}>
                        Une bibliothèque en constante évolution
                    </h2>
                    <div
                        className="w-24 h-1 mx-auto rounded-full mb-6"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <p className="max-w-2xl mx-auto text-gray-600">
                        Découvrez l'étendue de notre bibliothèque à travers quelques chiffres qui témoignent
                        de notre engagement envers la culture et le savoir.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {statistics.map((stat, index) => (
                        <StatItem
                            key={`stat-${index}`}
                            number={stat.number}
                            text={stat.text}
                            delay={0.1 * (index + 1)}
                        />
                    ))}
                </div>

                <motion.div
                    className="mt-16 p-8 rounded-2xl"
                    style={{
                        background: `linear-gradient(to right, ${secondaryColor}05, ${primaryColor}05)`
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-2xl font-bold mb-2" style={{ color: secondaryColor }}>
                                Vous voulez en savoir plus?
                            </h3>
                            <p className="text-gray-600">
                                Découvrez notre catalogue complet et toutes nos activités
                            </p>
                        </div>
                        <motion.a
                            href="/services"
                            className="font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-white"
                            style={{
                                background: `linear-gradient(to right, ${secondaryColor}, ${primaryColor})`
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Découvrir nos services
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default StatisticsSection;
