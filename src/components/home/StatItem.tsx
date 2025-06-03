import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useConfig } from '../../contexts/ConfigContext.tsx';

interface StatItemProps {
    number: string;
    text: string;
    delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ number, text, delay }) => {
    const { orgSettings } = useConfig();
    const [count, setCount] = useState<number>(0);
    const ref = useRef<HTMLDivElement>(null);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Animation du compteur quand visible
                    const num = parseInt(number.replace(/\D/g, ''));
                    const duration = 2000; // 2 secondes
                    const step = Math.max(1, Math.floor(num / (duration / 16)));
                    let current = 0;

                    const timer = setInterval(() => {
                        current += step;
                        if (current > num) {
                            setCount(num);
                            clearInterval(timer);
                        } else {
                            setCount(current);
                        }
                    }, 16);

                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [number]);

    return (
        <motion.div
            ref={ref}
            className="relative p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
        >
            <div
                className="absolute top-0 left-0 w-full h-1 rounded-t-xl"
                style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
                }}
            />
            <div
                className="text-5xl font-bold mb-3"
                style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}
            >
                {count}+
            </div>
            <p className="text-gray-600 font-medium">{text}</p>
        </motion.div>
    );
};

export default StatItem;
