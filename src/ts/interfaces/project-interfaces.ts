
/**
 * Base interface representing the minimum required properties of a project.
 */
export interface BaseProject {
    projectNumber: number; 
}

/**
 * Interface representing detailed information about a project.
 */
export interface Project extends BaseProject {
    project: string;
    title: string;
    category: string;
    program: string | null;
    country: string | null;
    city: string | null;
    street: string | null;
    houseNumber: string | null;
    cantonRegion: string | null;
    zipCode: string | null;
    GPS: string | null;
    year: number;
    projectNumber: number;
    cadNum: string | null;
    client: string | null;
    buildingCosts: string | null;
    deepness: string | null;
    phase: string | null;
    subphase: string | null;
    seaElevation: string | null;
}


/**
 * Interface for storing metadata related to a project.
 */
export interface ProjectMetadata extends BaseProject {
    project: string;
    year: number;
    projectNumber: number;
    numberOfImages: number;
    youtubeVideoLink: string;
    projectboard: string;
}
