import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import TestimonialCard, { TestimonialData } from './TestimonialCard.tsx';

interface TestimonialsSectionProps {
    testimonials: TestimonialData[];
}

const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
    const { orgSettings } = useConfig();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [startX, setStartX] = useState<number>(0);
    const [scrollLeft, setScrollLeft] = useState<number>(0);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    const startDragging = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const stopDragging = () => {
        setIsDragging(false);
    };

    const move = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const scrollTestimonials = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = direction === 'left' ? -400 : 400;
        scrollRef.current.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <section className="py-20 bg-gray-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-5" />

            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-12"
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
                    <p
                        className="text-4xl font-bold mb-6 py-1 px-3 rounded-full"
                        style={{ backgroundColor: `${secondaryColor}10` }}
                    >
                        Témoignages
                    </p>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: secondaryColor }}>
                        Ce que disent nos lecteurs
                    </h2>
                    <div
                        className="w-24 h-1 mx-auto rounded-full mb-6"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <p className="max-w-2xl mx-auto text-gray-600">
                        Découvrez les expériences partagées par notre communauté de lecteurs et d'apprenants passionnés.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Bouton précédent */}
                    <button
                        onClick={() => scrollTestimonials('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{ color: secondaryColor }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = primaryColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = secondaryColor;
                        }}
                        aria-label="Témoignages précédents"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Container des témoignages */}
                    <div
                        ref={scrollRef}
                        className="flex space-x-6 overflow-x-auto py-6 px-4 scrollbar-hide cursor-grab active:cursor-grabbing"
                        style={{
                            scrollBehavior: 'smooth',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}
                        onMouseDown={startDragging}
                        onMouseLeave={stopDragging}
                        onMouseUp={stopDragging}
                        onMouseMove={move}
                    >
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={`${testimonial.name}-${index}`}
                                testimonial={testimonial}
                                delay={0.1 * (index + 1)}
                            />
                        ))}
                    </div>

                    {/* Bouton suivant */}
                    <button
                        onClick={() => scrollTestimonials('right')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{ color: secondaryColor }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = primaryColor;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = secondaryColor;
                        }}
                        aria-label="Témoignages suivants"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Indicateurs */}
                <div className="mt-8 flex justify-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <span className="w-3 h-3 rounded-full bg-gray-300" />
                    <span className="w-3 h-3 rounded-full bg-gray-300" />
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
