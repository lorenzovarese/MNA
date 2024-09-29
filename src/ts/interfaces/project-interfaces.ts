
/**
 * Base interface representing the minimum required properties of a project.
 */
export interface BaseProject {
    projectNumber: number;  // Unique project identifier, e.g., "19" for "019.004_piazzafontana.milano"
    projectName: string;  // Project name, e.g., "019.004_piazzafontana.milano"
}

/**
 * Interface representing detailed information about a project.
 */
export interface Project extends BaseProject {
    year: number;  // Year of the project, e.g., 2004, 2007
    title: string;  // Project title, e.g., "piazzafontana.milano"
    category: string;  // Project category, e.g., "urban planning", "installation"
    program: string | null;  // Program associated with the project, e.g., "museum", "institute", or null if not applicable
    country: string | null;  // Country where the project is located, e.g., "Italy", "Switzerland"
    city: string | null;  // City where the project is located, e.g., "Milan", "Zurich"
    street: string | null;  // Street name, e.g., "Piazza Fontana", "Via Ostiense"
    houseNumber: string | null;  // House number, if applicable
    cantonRegion: string | null;  // Canton or region, e.g., "Lombardy", "Zürich"
    zipCode: string | null;  // ZIP or postal code, e.g., "20122", "8049"
    gps: { latitude: number, longitude: number } | null;  // GPS coordinates wrapped in an object, or null if not available
    cadNum: string | null;  // CAD number or code, if available
    client: string | null;  // Name of the client, or null if not applicable
    buildingCosts: string | null;  // Building costs associated with the project, or null if not provided
    deepness: string | null;  // Depth of the project, or null if not applicable
    phase: number | null;  // Phase of the project, e.g., "1" for initial phase
    subPhase: string | null;  // Subphase, e.g., "2", representing detailed progress stages
    seaElevation: string | null;  // Sea elevation, if applicable, or null
}

/**
 * Interface for storing metadata related to a project.
 */
export interface ProjectMetadata extends BaseProject {
    common: {
      covers: boolean;  // Yes/No
      texts: Record<string, string | null> | null;  // Dictionary of language codes and their respective texts (initially null) or null if N/A or empty
      youtubeVideoLink?: string;  // Optional URL for a YouTube video
    };
    study: {
      available: boolean;  // Yes/No
      conceptsTexts: Record<string, string | null> | null;  // Dictionary of language codes and their respective texts or null if N/A or empty
      plans?: number | null;  // Number of plans, 0 or null if unavailable
      visualizationsPhotos?: number | null;  // Number of visualizations/photos, 0 or null if unavailable
      videos?: number | null;  // Number of videos, 0 or null if unavailable
      dossiers?: number | null;  // Number of dossiers, 0 or null if unavailable
    };
    project: {
      available: boolean;  // Yes/No
      conceptsTexts: Record<string, string | null> | null;  // Dictionary of language codes and their respective texts or null if N/A or empty
      plans?: number | null;  // Number of plans, 0 or null if unavailable
      visualizationsPhotos?: number | null;  // Number of visualizations/photos, 0 or null if unavailable
      videos?: number | null;  // Number of videos, 0 or null if unavailable
      dossiers?: number | null;  // Number of dossiers, 0 or null if unavailable
    };
    realization: {
      available: boolean;  // Yes/No
      conceptsTexts: Record<string, string | null> | null;  // Dictionary of language codes and their respective texts or null if N/A or empty
      plans?: number | null;  // Number of plans, 0 or null if unavailable
      visualizationsPhotos?: number | null;  // Number of visualizations/photos, 0 or null if unavailable
      videos?: number | null;  // Number of videos, 0 or null if unavailable
      dossiers?: number | null;  // Number of dossiers, 0 or null if unavailable
    };
}
