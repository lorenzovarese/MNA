import { BaseProject, Project, ProjectMetadata } from "./interfaces/project-interfaces";

/**
 * Helper function to parse language codes from a CSV field and return an array of language codes.
 * @param {string} text - A string containing language codes (e.g., "DE, EN, IT") or "N/A".
 * @returns {string[] | null} An array of language codes or null if N/A or empty.
 */
function parseLanguageCodes(text: string): string[] | null {
    if (text === "N/A" || !text) {
        return null;
    }

    const languages = text.split(',').map(code => code.trim().toUpperCase());
    return languages.length > 0 ? languages : null;
}

/**
 * Helper function to parse GPS coordinates (latitude and longitude) from separate strings.
 * @param latStr - A string representing the latitude.
 * @param lonStr - A string representing the longitude.
 * @returns An object containing `latitude` and `longitude`, or `null` if invalid.
 */
function parseGps(latStr: string | null, lonStr: string | null): { latitude: number; longitude: number } | null {
    if (!latStr || !lonStr) {
        return null;
    }

    const latitude = parseFloat(latStr.trim());
    const longitude = parseFloat(lonStr.trim());

    if (isNaN(latitude) || isNaN(longitude)) {
        return null;
    }

    return { latitude, longitude };
}

/**
 * Helper function to parse phases from a CSV field into an array of numbers.
 * @param {string} phasesStr - A string containing phase numbers (e.g., "2, 1, 3").
 * @returns {number[] | null} An array of phase numbers or null if empty.
 */
function parsePhases(phasesStr: string): number[] | null {
    if (!phasesStr) {
        return null;
    }

    const phases = phasesStr.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
    return phases.length > 0 ? phases : null;
}

/**
 * Parses a CSV string into a dictionary of Project objects.
 * @param {string} csvData - The CSV file content as a string.
 * @param {string} separator - The column separator, usually the comma or the semicolon.
 * @returns {Record<string, Project>} A dictionary of Project objects indexed by the project ID.
 */
function parseCsvToDictProject(csvData: string, separator: string): Record<string, Project> {
    let dict: Record<string, Project> = {};

    try {
        const rows = csvData.trim().split("\n");
        rows.slice(1).forEach(row => {
            const columns = parseCsvLine(row, separator);

            const projectName: string = columns[0];
            const projectId: number = parseInt(columns[1], 10);

            // Parse GPS coordinates from separate latitude and longitude columns
            const gps = parseGps(columns[14], columns[15]);

            const project: Project = {
                projectId: projectId,
                projectName: projectName,
                year: parseInt(columns[2], 10),
                title: columns[3],
                category: columns[4],
                phases: parsePhases(columns[5]),
                program: columns[6] || null,
                country: columns[7] || null,
                city: columns[8] || null,
                street: columns[9] || null,
                houseNumber: columns[10] || null,
                numberRange: columns[11] || null,
                cantonRegion: columns[12] || null,
                zipCode: columns[13] || null,
                gps: gps, // Either a valid GPS object or null
                cadNum: columns[16] || null,
                client: columns[17] || null,
                buildingCosts: columns[18] || null,
                currency: columns[19] || null,
                depth: columns[20] || null,
                subphase: columns[21] || null,
            };
            dict[projectId] = project;
        });
    } catch (error) {
        console.error("Error parsing Project CSV data:", error);
        return {};
    }

    return dict;
}

/**
 * Parses a CSV string into a dictionary of ProjectMetadata objects.
 * @param {string} csvData - The CSV file content as a string.
 * @param {string} separator - The column separator, usually the comma or the semicolon.
 * @returns {Record<string, ProjectMetadata>} A dictionary of ProjectMetadata objects indexed by the project ID.
 */
function parseCsvToDictMetadata(csvData: string, separator: string): Record<string, ProjectMetadata> {
    let dict: Record<string, ProjectMetadata> = {};

    try {
        const rows = csvData.trim().split("\n");
        rows.slice(1).forEach(row => {
            const columns = parseCsvLine(row, separator);

            const projectName: string = columns[0];
            const projectId: number = parseInt(projectName.split("_")[0].split(".")[0], 10); // Extract project ID from the name

            // Map the columns to the metadata structure
            const metadata: ProjectMetadata = {
                projectId: projectId,
                projectName: projectName,
                common: {
                    available: columns[1] === 'Yes',
                    covers: columns[2] === 'Yes',
                    texts: parseLanguageCodes(columns[3]),
                    youtubeVideoLink: columns[10] || undefined,
                },
                study: {
                    available: columns[4] === 'Yes',
                    conceptsTexts: parseLanguageCodes(columns[5]),
                    plans: columns[6] ? parseInt(columns[6], 10) : null,
                    visualizationsPhotos: columns[7] ? parseInt(columns[7], 10) : null,
                    videos: columns[8] ? parseInt(columns[8], 10) : null,
                    dossiers: columns[9] ? parseInt(columns[9], 10) : null,
                    youtubeVideoLink: columns[10] || undefined,
                },
                project: {
                    available: columns[11] === 'Yes',
                    conceptsTexts: parseLanguageCodes(columns[12]),
                    plans: columns[13] ? parseInt(columns[13], 10) : null,
                    visualizationsPhotos: columns[14] ? parseInt(columns[14], 10) : null,
                    videos: columns[15] ? parseInt(columns[15], 10) : null,
                    dossiers: columns[16] ? parseInt(columns[16], 10) : null,
                    youtubeVideoLink: columns[17] || undefined,
                },
                realization: {
                    available: columns[18] === 'Yes',
                    conceptsTexts: parseLanguageCodes(columns[19]),
                    plans: columns[20] ? parseInt(columns[20], 10) : null,
                    visualizationsPhotos: columns[21] ? parseInt(columns[21], 10) : null,
                    videos: columns[22] ? parseInt(columns[22], 10) : null,
                    dossiers: columns[23] ? parseInt(columns[23], 10) : null,
                    youtubeVideoLink: columns[24] || undefined,
                },
            };
            dict[projectId] = metadata;
        });
    } catch (error) {
        console.error("Error parsing ProjectMetadata CSV data:", error);
        return {};
    }

    return dict;
}

/**
 * Parses a single line of CSV data into an array of strings, handling quoted sections and separators correctly.
 * @param {string} text - A single line of CSV data.
 * @param {string} separator - The column separator, usually the comma or the semicolon.
 * @returns {string[]} An array of values derived from the CSV line.
 */
function parseCsvLine(text: string, separator: string): string[] {
    const regex = new RegExp(`(${separator}|\\r?\\n|\\r|^)("(?:[^"]*(?:""[^"]*)*)"|[^"${separator}\\r\\n]*|(?<=${separator}|^))`, 'g');
    const columns: string[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
        let value = match[2];
        if (value.startsWith('"') && value.endsWith('"')) {
            value = value.substring(1, value.length - 1).replace(/""/g, '"');
        }
        columns.push(value.trim());
    }

    return columns;
}

/**
 * Fetches CSV data from a given URL and stores it locally after processing.
 * If data for the given key already exists in local storage, it skips fetching.
 * @param {string} url - URL to fetch the CSV data from.
 * @param {string} separator - The column separator, usually the comma or the semicolon.
 * @param {string} storageKey - Local storage key under which the data will be stored.
 * @param {(csvData: string, separator: string) => Record<string, T>} parseCsvToDictFunc - Function that parses CSV data into a dictionary.
 * @template T - Extends BaseProject indicating the type of the data to fetch and store.
 */
async function fetchAndStore<T>(
    url: string,
    separator: string,
    storageKey: string,
    parseCsvToDictFunc: (csvData: string, separator: string) => Record<string, T>
): Promise<void> {
    if (localStorage.getItem(storageKey)) {
        console.log(`${storageKey} data already loaded.`);
        return;
    }
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvData = await response.text();
        const data = parseCsvToDictFunc(csvData, separator);
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.log(`${storageKey} data loaded and stored.`);

        // Store the last update timestamp
        const timestampKey = `lastUpdate_${storageKey}`;
        const currentTimestamp = new Date().toISOString(); // Store the ISO timestamp
        localStorage.setItem(timestampKey, currentTimestamp);

        console.log(`${storageKey} data loaded and stored with last update at ${currentTimestamp}.`);
        document.dispatchEvent(new CustomEvent('ProjectsDataLoaded'));
    } catch (error) {
        console.error(`Error fetching and storing ${storageKey} data:`, error);
    }
}

/**
 * Main function to orchestrate the fetching and storing of project data.
 * This function serves as the entry point for the application, ensuring data is
 * fetched from specified CSV files and stored appropriately in local storage.
 * It handles both project and project metadata information.
 *
 * @async
 * Calls asynchronous fetchAndStore functions to process and store CSV data
 * for 'projects' and 'project metadata' from respective files.
 */
async function main() {
    // Fetching and storing projects data
    await fetchAndStore<Project>("../assets/data/projects.csv", ",", "projectsData", parseCsvToDictProject);

    // Fetching and storing project media data
    await fetchAndStore<ProjectMetadata>("../assets/data/projects_media.csv", ",", "projectsMetadata", parseCsvToDictMetadata);
}

// Execute main function
main();
