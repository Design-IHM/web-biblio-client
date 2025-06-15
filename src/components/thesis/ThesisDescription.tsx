import React, { useState } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { BiblioThesis } from '../../types/thesis';
import { ChevronDown, ChevronUp, FileText, Info } from 'lucide-react';

interface ThesisDescriptionProps {
    thesis: BiblioThesis;
}

const ThesisDescription: React.FC<ThesisDescriptionProps> = ({ thesis }) => {
    const { orgSettings } = useConfig();
    const [isExpanded, setIsExpanded] = useState(false);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';
    const secondaryColor = orgSettings?.Theme?.Secondary || '#1b263b';

    const shouldShowExpandButton = thesis.abstract && thesis.abstract.length > 300;
    const displayText = shouldShowExpandButton && !isExpanded
        ? thesis.abstract.substring(0, 300) + '...'
        : thesis.abstract;

    if (!thesis.abstract || thesis.abstract.trim() === '') {
        return (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
                <div className="flex items-center mb-4">
                    <Info className="w-6 h-6 mr-3" style={{ color: primaryColor }} />
                    <h2 className="text-2xl font-bold text-gray-900">Résumé</h2>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aucun résumé disponible pour ce mémoire.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:p-8">
            {/* En-tête */}
            <div className="flex items-center mb-6">
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${primaryColor}15` }}
                >
                    <FileText className="w-5 h-5" style={{ color: primaryColor }} />
                </div>
                <h2 className="text-2xl font-bold" style={{ color: secondaryColor }}>
                    Résumé
                </h2>
            </div>

            {/* Contenu du résumé */}
            <div className="prose prose-lg max-w-none">
                <div
                    className="text-gray-700 leading-relaxed"
                    style={{ lineHeight: '1.8' }}
                >
                    {displayText.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Bouton d'expansion */}
                {shouldShowExpandButton && (
                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex cursor-pointer items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
                            style={{
                                backgroundColor: `${primaryColor}10`,
                                color: primaryColor,
                                border: `1px solid ${primaryColor}30`
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = `${primaryColor}20`;
                                e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = `${primaryColor}10`;
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-5 h-5 mr-2" />
                                    Voir moins
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-5 h-5 mr-2" />
                                    Lire la suite
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThesisDescription;
