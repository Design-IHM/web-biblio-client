// src/components/ui/DragDropUploader.tsx
import React, { useState, useRef, useCallback } from 'react';
import { useConfig } from '../../contexts/ConfigContext';
import { cloudinaryService, UploadProgress } from '../../services/cloudinaryService';
import { Upload, X, Eye, File, CheckCircle } from 'lucide-react';

interface UploadedFile {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
}

interface DragDropUploaderProps {
    onFilesUploaded: (files: UploadedFile[]) => void;
    onFileRemoved?: (fileId: string) => void;
    multiple?: boolean;
    maxFiles?: number;
    folder?: string;
    maxSizeMB?: number;
    acceptedTypes?: string[];
    showPreview?: boolean;
    disabled?: boolean;
    className?: string;
    description?: string;
}

const DragDropUploader: React.FC<DragDropUploaderProps> = ({
                                                               onFilesUploaded,
                                                               onFileRemoved,
                                                               multiple = true,
                                                               maxFiles = 10,
                                                               folder = "uploads",
                                                               maxSizeMB = 20,
                                                               acceptedTypes = ['jpg', 'jpeg', 'png', 'webp', 'gif'],
                                                               showPreview = true,
                                                               disabled = false,
                                                               className = "",
                                                               description = "Glissez-déposez vos images ici ou cliquez pour sélectionner"
                                                           }) => {
    const { orgSettings } = useConfig();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map());
    const [errors, setErrors] = useState<string[]>([]);

    const primaryColor = orgSettings?.Theme?.Primary || '#ff8c00';

    // Validation des fichiers
    const validateFiles = useCallback((files: FileList): { valid: File[]; errors: string[] } => {
        const validFiles: File[] = [];
        const newErrors: string[] = [];

        Array.from(files).forEach((file) => {
            // Vérifier le type
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            if (!acceptedTypes.includes(fileExtension || '')) {
                newErrors.push(`${file.name}: Type de fichier non autorisé`);
                return;
            }

            // Vérifier la taille
            if (file.size > maxSizeMB * 1024 * 1024) {
                newErrors.push(`${file.name}: Taille trop importante (max ${maxSizeMB}MB)`);
                return;
            }

            // Vérifier le nombre maximum
            if (uploadedFiles.length + validFiles.length >= maxFiles) {
                newErrors.push(`Nombre maximum de fichiers atteint (${maxFiles})`);
                return;
            }

            validFiles.push(file);
        });

        return { valid: validFiles, errors: newErrors };
    }, [acceptedTypes, maxSizeMB, maxFiles, uploadedFiles.length]);

    // Upload des fichiers
    const uploadFiles = async (files: File[]) => {
        if (disabled || files.length === 0) return;

        const newUploadingFiles = new Map(uploadingFiles);

        // Initialiser le progrès pour chaque fichier
        files.forEach((file) => {
            const fileId = `${file.name}_${Date.now()}_${Math.random()}`;
            newUploadingFiles.set(fileId, 0);
        });

        setUploadingFiles(newUploadingFiles);

        const uploadPromises = files.map(async (file) => {
            const fileId = `${file.name}_${Date.now()}_${Math.random()}`;

            try {
                const response = await cloudinaryService.uploadGeneral(
                    file,
                    folder,
                    (progress: UploadProgress) => {
                        setUploadingFiles(prev => new Map(prev.set(fileId, progress.percentage)));
                    }
                );

                if (response.success && response.url) {
                    const uploadedFile: UploadedFile = {
                        id: fileId,
                        name: file.name,
                        url: response.url,
                        size: file.size,
                        type: file.type
                    };

                    setUploadedFiles(prev => [...prev, uploadedFile]);
                    return uploadedFile;
                } else {
                    throw new Error(response.error || 'Erreur lors de l\'upload');
                }
            } catch (error) {
                console.error('Erreur upload:', error);
                setErrors(prev => [...prev, `${file.name}: ${error instanceof Error ? error.message : 'Erreur inconnue'}`]);
                return null;
            } finally {
                setUploadingFiles(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(fileId);
                    return newMap;
                });
            }
        });

        const results = await Promise.all(uploadPromises);
        const successfulUploads = results.filter((file): file is UploadedFile => file !== null);

        if (successfulUploads.length > 0) {
            onFilesUploaded(successfulUploads);
        }
    };

    // Gestion du drag & drop
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files.length === 0) return;

        setErrors([]);
        const { valid, errors } = validateFiles(files);

        if (errors.length > 0) {
            setErrors(errors);
        }

        if (valid.length > 0) {
            await uploadFiles(valid);
        }
    }, [disabled, validateFiles, uploadFiles]);

    // Gestion de la sélection de fichiers
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setErrors([]);
        const { valid, errors } = validateFiles(files);

        if (errors.length > 0) {
            setErrors(errors);
        }

        if (valid.length > 0) {
            await uploadFiles(valid);
        }

        e.target.value = ''; // Reset input
    };

    // Supprimer un fichier
    const handleRemoveFile = (fileId: string) => {
        setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
        if (onFileRemoved) {
            onFileRemoved(fileId);
        }
    };

    // Déclencher la sélection de fichiers
    const handleSelectFiles = () => {
        if (disabled) return;
        fileInputRef.current?.click();
    };

    // Formater la taille du fichier
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`w-full ${className}`}>
            <input
                ref={fileInputRef}
                type="file"
                multiple={multiple}
                accept={acceptedTypes.map(type => `image/${type}`).join(',')}
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled}
            />

            {/* Zone de drop */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleSelectFiles}
                className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
          ${disabled
                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                    : isDragging
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }
        `}
                style={{
                    borderColor: !disabled && isDragging ? primaryColor : undefined,
                    backgroundColor: !disabled && isDragging ? `${primaryColor}10` : undefined
                }}
            >
                <div className="flex flex-col items-center justify-center space-y-4">
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${primaryColor}15` }}
                    >
                        <Upload
                            size={40}
                            style={{ color: primaryColor }}
                        />
                    </div>

                    <div>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                            {description}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            {acceptedTypes.map(t => t.toUpperCase()).join(', ')} - Max {maxSizeMB}MB
                        </p>
                        <p className="text-xs text-gray-400">
                            {multiple ? `Jusqu'à ${maxFiles} fichiers` : '1 fichier seulement'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages d'erreur */}
            {errors.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <X size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-medium text-red-800 mb-1">Erreurs d'upload :</h4>
                            <ul className="text-sm text-red-600 space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index}>• {error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <button
                        onClick={() => setErrors([])}
                        className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                        Masquer les erreurs
                    </button>
                </div>
            )}

            {/* Fichiers en cours d'upload */}
            {uploadingFiles.size > 0 && (
                <div className="mt-4 space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Upload en cours...</h4>
                    {Array.from(uploadingFiles.entries()).map(([fileId, progress]) => (
                        <div key={fileId} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 truncate">
                  {fileId.split('_')[0]}
                </span>
                                <span className="text-xs text-gray-500">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${progress}%`,
                                        backgroundColor: primaryColor
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Fichiers uploadés */}
            {uploadedFiles.length > 0 && showPreview && (
                <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <CheckCircle size={16} className="text-green-600 mr-2" />
                        Fichiers uploadés ({uploadedFiles.length})
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {uploadedFiles.map((file) => (
                            <div
                                key={file.id}
                                className="relative bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
                            >
                                {/* Bouton de suppression */}
                                <button
                                    onClick={() => handleRemoveFile(file.id)}
                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                                >
                                    <X size={12} />
                                </button>

                                {/* Prévisualisation */}
                                {file.type.startsWith('image/') ? (
                                    <div className="relative group">
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-full h-32 object-cover rounded-md"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-md flex items-center justify-center">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Eye size={24} className="text-white" />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                                        <File size={40} className="text-gray-400" />
                                    </div>
                                )}

                                {/* Informations du fichier */}
                                <div className="mt-3">
                                    <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>

                                {/* Lien vers le fichier */}
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center text-xs hover:underline"
                                    style={{ color: primaryColor }}
                                >
                                    <Eye size={12} className="mr-1" />
                                    Voir le fichier
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Résumé des uploads */}
            {uploadedFiles.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-600" />
                        <span className="text-sm text-green-800">
              {uploadedFiles.length} fichier{uploadedFiles.length > 1 ? 's' : ''} uploadé{uploadedFiles.length > 1 ? 's' : ''} avec succès
            </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DragDropUploader;
