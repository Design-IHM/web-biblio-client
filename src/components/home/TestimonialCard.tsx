import React from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../../contexts/ConfigContext.tsx';
import StarRating from './StarRating.tsx';

export interface TestimonialData {
    name: string;
    role: string;
    text: string;
    avatar?: string;
    rating?: number;
}

interface TestimonialCardProps {
    testimonial: TestimonialData;
    delay: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, delay }) => {
    const { orgSettings } = useConfig();
    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    const { name, role, text, avatar, rating = 5 } = testimonial;

    return (
        <motion.div
            className="flex-shrink-0 w-full md:w-80 lg:w-96 bg-white p-6 rounded-xl shadow-md transform transition-all duration-300 hover:shadow-xl border-t-4"
            style={{ borderTopColor: primaryColor }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center mb-4">
                <div
                    className="w-14 h-14 rounded-full p-0.5 shadow-lg"
                    style={{
                        background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})`
                    }}
                >
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {avatar ? (
                            <img
                                src={avatar}
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">
                  {name.charAt(0).toUpperCase()}
                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="ml-4">
                    <h4 className="font-semibold text-lg" style={{ color: secondaryColor }}>
                        {name}
                    </h4>
                    <p className="text-sm text-gray-500">{role}</p>
                </div>
            </div>

            <div className="relative mb-6">
                <svg
                    className="absolute top-0 left-0 w-8 h-8 opacity-10 transform -translate-x-4 -translate-y-4"
                    style={{ color: primaryColor }}
                    fill="currentColor"
                    viewBox="0 0 32 32"
                >
                    <path d="M10 8v8H6v-4c0-2.2 1.8-4 4-4zm12 0v8h-4v-4c0-2.2 1.8-4 4-4z" />
                </svg>
                <p className="text-gray-600 italic leading-relaxed">
                    {text}
                </p>
                <svg
                    className="absolute bottom-0 right-0 w-8 h-8 opacity-10 transform translate-x-2 translate-y-2"
                    style={{ color: primaryColor }}
                    fill="currentColor"
                    viewBox="0 0 32 32"
                >
                    <path d="M22 24v-8h4v4c0 2.2-1.8 4-4 4zm-12 0v-8h4v4c0 2.2-1.8 4-4 4z" />
                </svg>
            </div>

            <StarRating rating={rating} size="md" />
        </motion.div>
    );
};

export default TestimonialCard;
