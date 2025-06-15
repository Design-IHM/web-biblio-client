// src/components/ui/SimpleImageUploader.tsx
import React, { useState, useRef } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { cloudinaryService, UploadProgress } from '../../services/cloudinaryService';
import { Upload, Image as ImageIcon, X, Eye } from 'lucide-react';

interface SimpleImageUploaderProps {
    onImageUploaded: (imageUrl: string) => void;
    onImageRemoved?: () => void;
    initialImage?: string;
    placeholder?: string;
    folder?: string;
    maxSizeMB?: number;
    acceptedFormats?: string[];
    showPreview?: boolean;
    disabled?: boolean;
    className?: string;
}

const SimpleImageUploader: React.FC<SimpleImageUploaderProps> = ({
                                                                     onImageUploaded,
                                                                     onImageRemoved,
                                                                     initialImage,
                                                                     placeholder = "Cliquez pour sélectionner une image",
                                                                     folder = "general",
                                                                     maxSizeMB = 10,
                                                                     acceptedFormats = ['jpg', 'jpeg', 'png', 'webp'],
                                                                     showPreview = true,
                                                                     disabled = false,
                                                                     className = ""
                                                                 }) => {
    const { orgSettings } = useConfig();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [imageUrl, setImageUrl] = useState<string | undefined>(initialImage);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string>('');
    const [showFullImage, setShowFullImage] = useState(false);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';

    // Déclencher la sélection de fichier
    const handleSelectFile = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    // Gérer la sélection de fichier
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        await handleUpload(file);
        e.target.value = ''; // Reset input
    };

    // Upload du fichier
    const handleUpload = async (file: File) => {
        setError('');
        setIsUploading(true);
        setUploadProgress(0);

        // Validation de taille
        if (file.size > maxSizeMB * 1024 * 1024) {
            setError(`La taille du fichier ne doit pas dépasser ${maxSizeMB}MB`);
            setIsUploading(false);
            return;
        }

        // Créer une prévisualisation locale
        const localPreview = URL.createObjectURL(file);
        setImageUrl(localPreview);

        try {
            const response = await cloudinaryService.uploadGeneral(
                file,
                folder,
                (progress: UploadProgress) => {
                    setUploadProgress(progress.percentage);
                }
            );

            // Libérer la mémoire de la prévisualisation locale
            URL.revokeObjectURL(localPreview);

            if (response.success && response.url) {
                setImageUrl(response.url);
                onImageUploaded(response.url);
            } else {
                setError(response.error || 'Erreur lors de l\'upload');
                setImageUrl(initialImage); // Revenir à l'image précédente
            }
        } catch (error) {
            console.error('Erreur upload image:', error);
            setError('Erreur inattendue lors de l\'upload');
            setImageUrl(initialImage);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    // Supprimer l'image
    const handleRemoveImage = () => {
        if (disabled) return;

        setImageUrl(undefined);
        setError('');

        if (onImageRemoved) {
            onImageRemoved();
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFormats.map(format => `image/${format}`).join(',')}
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
            />

            {imageUrl && showPreview ? (
                // Affichage de l'image avec options
                <div className="relative group">
                    <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                        <img
                            src={imageUrl}
                            alt="Image uploadée"
                            className="w-full h-48 object-cover cursor-pointer"
                            onClick={() => setShowFullImage(true)}
                        />

                        {/* Overlay avec boutons d'action */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button
                                onClick={() => setShowFullImage(true)}
                                className="bg-white text-gray-800 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                <Eye size={16} />
                                Voir
                            </button>

                            <button
                                onClick={handleSelectFile}
                                className="text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                style={{ backgroundColor: primaryColor }}
                            >
                                <Upload size={16} />
                                Changer
                            </button>

                            <button
                                onClick={handleRemoveImage}
                                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                            >
                                <X size={16} />
                                Supprimer
                            </button>
                        </div>

                        {/* Barre de progression pendant l'upload */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                <div className="text-center">
                                    <div
                                        className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin mb-3"
                                        style={{ borderTopColor: primaryColor }}
                                    ></div>
                                    <div className="text-white">
                                        <p className="text-sm font-medium mb-1">Upload en cours...</p>
                                        <p className="text-xs">{uploadProgress}%</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                // Zone de sélection d'image
                <div
                    onClick={handleSelectFile}
                    className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
            ${disabled
                        ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
            ${isUploading ? 'pointer-events-none' : ''}
          `}
                    style={{
                        borderColor: !disabled ? `${primaryColor}40` : undefined,
                        backgroundColor: !disabled ? `${primaryColor}05` : undefined
                    }}
                >
                    <div className="flex flex-col items-center justify-center space-y-3">
                        {isUploading ? (
                            <>
                                <div
                                    className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-transparent animate-spin"
                                    style={{ borderTopColor: primaryColor }}
                                ></div>
                                <p className="text-sm font-medium" style={{ color: primaryColor }}>
                                    Upload en cours... {uploadProgress}%
                                </p>
                            </>
                        ) : (
                            <>
                                <div
                                    className="w-16 h-16 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: `${primaryColor}15` }}
                                >
                                    <ImageIcon
                                        size={32}
                                        style={{ color: primaryColor }}
                                    />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                        {placeholder}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {acceptedFormats.map(f => f.toUpperCase()).join(', ')}
                                        {' '}(max {maxSizeMB}MB)
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors hover:opacity-90"
                                    style={{ backgroundColor: primaryColor }}
                                >
                                    Sélectionner une image
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Message d'erreur */}
            {error && (
                <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                </div>
            )}

            {/* Modal de visualisation plein écran */}
            {showFullImage && imageUrl && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowFullImage(false)}
                >
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={imageUrl}
                            alt="Image en grand"
                            className="max-w-full max-h-full object-contain"
                        />
                        <button
                            onClick={() => setShowFullImage(false)}
                            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black bg-opacity-50 text-white flex items-center justify-center hover:bg-opacity-70 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleImageUploader;
