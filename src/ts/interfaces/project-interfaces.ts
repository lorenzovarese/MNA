
/**
 * Base interface representing the minimum required properties of a project.
 */
export interface BaseProject {
    projectId: number;    // Unique project identifier, from "project_id"
    projectName: string;  // Project name, from "project_name"
}

/**
 * Interface representing detailed information about a project.
 */
export interface Project extends BaseProject {
    year: number;                     // Year of the project, from "year"
    title: string;                    // Project title, from "title"
    category: string;                 // Project category, from "category"
    phases: number[] | null;          // Array of phase numbers, parsed from "phases"
    program: string | null;           // Program associated with the project, from "program"
    country: string | null;           // Country where the project is located, from "country"
    city: string | null;              // City where the project is located, from "city"
    street: string | null;            // Street name, from "street"
    houseNumber: string | null;       // House number, from "number"
    numberRange: string | null;       // Number range, from "number_range"
    cantonRegion: string | null;      // Canton or region, from "canton/region"
    zipCode: string | null;           // ZIP or postal code, from "zip-code"
    gps: {                            // GPS coordinates, from "gps_latitude" and "gps_longitude"
        latitude: number;
        longitude: number;
    } | null;
    cadNum: string | null;            // CAD number or code, from "cad_num"
    client: string | null;            // Name of the client, from "client"
    buildingCosts: string | null;     // Building costs, from "building_costs"
    currency: string | null;          // Currency of the building costs, from "currency"
    depth: string | null;             // Depth of the project, from "depth"
    subphase: string | null;          // Subphase, from "subphase"
}

/**
 * Interface for storing metadata related to a project.
 */
export interface ProjectMetadata extends BaseProject {
    common: {
        available: boolean;           // From "common.available", parsed from "Yes"/"No"
        covers: boolean;              // From "common.covers", parsed from "Yes"/"No"
        texts: string[] | null;       // From "common.texts", array of language codes or null if "N/A" or empty
        youtubeVideoLink?: string;    // From "common.youtube.link", optional URL for a YouTube video
    };
    study: {
        available: boolean;           // From "study.available", parsed from "Yes"/"No"
        conceptsTexts: string[] | null;  // From "study.concepts.texts", array of language codes or null if "N/A" or empty
        plans?: number | null;        // From "study.plans", number of plans, or null if unavailable
        visualizationsPhotos?: number | null; // From "study.visualizations.photos", number or null
        videos?: number | null;       // From "study.videos", number or null
        dossiers?: number | null;     // From "study.dossiers", number or null
        youtubeVideoLink?: string;    // From "study.youtube.link", optional URL
    };
    project: {
        available: boolean;           // From "project.available", parsed from "Yes"/"No"
        conceptsTexts: string[] | null;  // From "project.concepts.texts", array of language codes or null
        plans?: number | null;        // From "project.plans", number or null
        visualizationsPhotos?: number | null; // From "project.visualizations.photos", number or null
        videos?: number | null;       // From "project.videos", number or null
        dossiers?: number | null;     // From "project.dossiers", number or null
        youtubeVideoLink?: string;    // From "project.youtube.link", optional URL
    };
    realization: {
        available: boolean;           // From "realization.available", parsed from "Yes"/"No"
        conceptsTexts: string[] | null;  // From "realization.concepts.texts", array of language codes or null
        plans?: number | null;        // From "realization.plans", number or null
        visualizationsPhotos?: number | null; // From "realization.visualizations.photos", number or null
        videos?: number | null;       // From "realization.videos", number or null
        dossiers?: number | null;     // From "realization.dossiers", number or null
        youtubeVideoLink?: string;    // From "realization.youtube.link", optional URL
    };
}
