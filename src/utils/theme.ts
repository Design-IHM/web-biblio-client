/**
 * Convertit une couleur hexadécimale en valeurs RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Convertit des valeurs RGB en chaîne CSS
 */
export function rgbToString(r: number, g: number, b: number): string {
    return `${r}, ${g}, ${b}`;
}

/**
 * Calcule la luminance relative d'une couleur
 */
export function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const { r, g, b } = rgb;

    // Normaliser les valeurs RGB
    const normalize = (value: number) => {
        const normalized = value / 255;
        return normalized <= 0.03928
            ? normalized / 12.92
            : Math.pow((normalized + 0.055) / 1.055, 2.4);
    };

    return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
}

/**
 * Détermine si une couleur est claire ou sombre
 */
export function isLightColor(hex: string): boolean {
    return getLuminance(hex) > 0.5;
}

/**
 * Obtient une couleur de contraste appropriée (noir ou blanc)
 */
export function getContrastColor(hex: string): string {
    return isLightColor(hex) ? '#000000' : '#ffffff';
}

/**
 * Assombrit ou éclaircit une couleur
 */
export function adjustBrightness(hex: string, amount: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const adjust = (value: number) => {
        const adjusted = value + amount;
        return Math.max(0, Math.min(255, adjusted));
    };

    const r = adjust(rgb.r).toString(16).padStart(2, '0');
    const g = adjust(rgb.g).toString(16).padStart(2, '0');
    const b = adjust(rgb.b).toString(16).padStart(2, '0');

    return `#${r}${g}${b}`;
}

/**
 * Génère une couleur avec une opacité donnée
 */
export function withOpacity(hex: string, opacity: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * Applique un thème à l'élément root du document
 */
export function applyThemeToRoot(primaryColor: string, secondaryColor: string): void {
    const root = document.documentElement;

    // Couleurs principales
    root.style.setProperty('--color-primary', primaryColor);
    root.style.setProperty('--color-secondary', secondaryColor);
    root.style.setProperty('--tw-color-primary', primaryColor);
    root.style.setProperty('--tw-color-secondary', secondaryColor);

    // Valeurs RGB pour les variations avec opacité
    const primaryRgb = hexToRgb(primaryColor);
    const secondaryRgb = hexToRgb(secondaryColor);

    if (primaryRgb) {
        root.style.setProperty('--primary-rgb', rgbToString(primaryRgb.r, primaryRgb.g, primaryRgb.b));
    }

    if (secondaryRgb) {
        root.style.setProperty('--secondary-rgb', rgbToString(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b));
    }

    // Variations de luminosité
    root.style.setProperty('--primary-light', adjustBrightness(primaryColor, 30));
    root.style.setProperty('--primary-dark', adjustBrightness(primaryColor, -30));
    root.style.setProperty('--secondary-light', adjustBrightness(secondaryColor, 30));
    root.style.setProperty('--secondary-dark', adjustBrightness(secondaryColor, -30));

    // Couleurs de contraste
    root.style.setProperty('--primary-contrast', getContrastColor(primaryColor));
    root.style.setProperty('--secondary-contrast', getContrastColor(secondaryColor));
}

/**
 * Génère des couleurs complémentaires basées sur une couleur principale
 */
export function generateColorPalette(baseColor: string) {
    return {
        primary: baseColor,
        primaryLight: adjustBrightness(baseColor, 40),
        primaryDark: adjustBrightness(baseColor, -40),
        primaryContrast: getContrastColor(baseColor),
        primary10: withOpacity(baseColor, 0.1),
        primary20: withOpacity(baseColor, 0.2),
        primary30: withOpacity(baseColor, 0.3),
        primary50: withOpacity(baseColor, 0.5),
        primary80: withOpacity(baseColor, 0.8),
    };
}

/**
 * Valide si une chaîne est une couleur hexadécimale valide
 */
export function isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Obtient les couleurs par défaut du thème
 */
export function getDefaultTheme() {
    return {
        primary: '#ff8c00',
        secondary: '#1b263b'
    };
}

/**
 * Mélange deux couleurs selon un ratio
 */
export function blendColors(color1: string, color2: string, ratio: number): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
