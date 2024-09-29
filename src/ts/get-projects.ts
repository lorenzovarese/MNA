import { BaseProject, Project, ProjectMetadata } from "./interfaces/project-interfaces";

/**
 * Helper function to parse language codes from a CSV field and return a dictionary with null values.
 * @param {string} text - A string containing language codes (e.g., "eng, ita, deu") or "N/A".
 * @returns {Record<string, null>} A dictionary where the keys are the language codes and values are initially null.
 */
function parseLanguageCodes(text: string): Record<string, null> | null{
    if (text === "N/A" || !text) {
        return null;
    }

    const languages = text.split(',').map(code => code.trim().toUpperCase());
    const dictionary: Record<string, null> = {};

    languages.forEach(language => {
        dictionary[language] = null; // Initialize all values as null, to be populated later
    });

    return dictionary;
}

/**
 * Helper function to parse GPS coordinates (latitude, longitude) from a string.
 * @param gpsString - A string representing GPS coordinates (e.g., "47.34256440219231, 8.552167877605461")
 * @returns An object containing `latitude` and `longitude`, or `null` if invalid
 */
function parseGps(gpsString: string | null): { latitude: number, longitude: number } | null {
    if (!gpsString) {
        return null;
    }

    const [lat, lon] = gpsString.split(',').map(coord => parseFloat(coord.trim()));

    if (isNaN(lat) || isNaN(lon)) {
        return null;
    }

    return { latitude: lat, longitude: lon };
}

/**
 * Parses a CSV string into a dictionary of Project objects.
 * @param {string} csvData - The CSV file content as a string.
 * @param {string} separator - The column separator, usually the comma or the semicolon.
 * @returns {Record<string, Project>} A dictionary of Project objects indexed by the project number.
 */
function parseCsvToDictProject(csvData: string, separator: string): Record<string, Project> {
    let dict: Record<string, Project> = {};

    try {
        const rows = csvData.trim().split("\n");
        rows.slice(1).forEach(row => {
            const columns = parseCsvLine(row, separator);

            const projectName : string = columns[0];
            const projectNumber : number = parseInt(columns[1], 10);
            const gps = parseGps(columns[12]);

            const project: Project = {
                projectName: projectName,
                projectNumber: projectNumber,
                year: parseInt(columns[2], 10),
                title: columns[3],
                category: columns[4],
                program: columns[5] || null,
                country: columns[6] || null,
                city: columns[7] || null,
                street: columns[8] || null,
                houseNumber: columns[9] || null,
                cantonRegion: columns[10] || null,
                zipCode: columns[11] || null,
                gps: gps, // Either a valid GPS object or null
                cadNum: columns[13] || null,
                client: columns[14] || null,
                buildingCosts: columns[15] || null,
                deepness: columns[16] || null,
                phase: parseInt(columns[17], 10) || null,
                subPhase: columns[18] || null,
                seaElevation: columns[19] || null,
            };
            dict[projectNumber] = project;
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
 * @returns {Record<string, ProjectMetadata>} A dictionary of ProjectMetadata objects indexed by the project number.
 */
function parseCsvToDictMetadata(csvData: string, separator: string): Record<string, ProjectMetadata> {
    let dict: Record<string, ProjectMetadata> = {};

    try {
        const rows = csvData.trim().split("\n");
        rows.slice(1).forEach(row => {
            const columns = parseCsvLine(row, separator);

            const projectName : string = columns[0];
            const projectNumber : number = parseInt(projectName.split(".")[0]); // Extract project number from the full name

            // Map the columns to the metadata structure
            const metadata: ProjectMetadata = {
                projectNumber: projectNumber,
                projectName: projectName,
                common: {
                    covers: columns[1] === 'Yes',
                    texts: parseLanguageCodes(columns[2]),
                    youtubeVideoLink: columns[3],
                },
                study: {
                    available: columns[4] === 'Yes',
                    conceptsTexts: parseLanguageCodes(columns[5]),
                    plans: columns[6] ? parseInt(columns[6], 10) : null,
                    visualizationsPhotos: columns[7] ? parseInt(columns[7], 10) : null,
                    videos: columns[8] ? parseInt(columns[8], 10) : null,
                    dossiers: columns[9] ? parseInt(columns[9], 10) : null,
                },
                project: {
                    available: columns[10] === 'Yes',
                    conceptsTexts: parseLanguageCodes(columns[11]),
                    plans: columns[12] ? parseInt(columns[12], 10) : null,
                    visualizationsPhotos: columns[13] ? parseInt(columns[13], 10) : null,
                    videos: columns[14] ? parseInt(columns[14], 10) : null,
                    dossiers: columns[15] ? parseInt(columns[15], 10) : null,
                },
                realization: {
                    available: columns[16] === 'Yes',
                    conceptsTexts: parseLanguageCodes(columns[17]),
                    plans: columns[18] ? parseInt(columns[18], 10) : null,
                    visualizationsPhotos: columns[19] ? parseInt(columns[19], 10) : null,
                    videos: columns[20] ? parseInt(columns[20], 10) : null,
                    dossiers: columns[21] ? parseInt(columns[21], 10) : null,
                }
            };
            dict[projectNumber] = metadata;
        });
    } catch (error) {
        console.error("Error parsing ProjectMetadata CSV data:", error);
        return {};
    }

    return dict;
}

/**
 * Parses a single line of CSV data into an array of strings, handling quoted sections and commas correctly.
 * @param {string} text - A single line of CSV data semicolon separated.
 * @param {string} separator - The column separator, usually the comma or the semicolon.
 * @returns {string[]} An array of values derived from the CSV line.
 */
function parseCsvLine(text: string, separator: string): string[] {
    let columns: string[] = [];
    let currentCol = "";
    let inQuotes = false;
    let charPrev = "";
    for (const char of text) {
        if (char === '"' && charPrev !== '"') {
            inQuotes = !inQuotes;
        } else if (char === separator && !inQuotes) {
            columns.push(currentCol);
            currentCol = "";
        } else {
            currentCol += char;
        }
        charPrev = char === '"' && charPrev === '"' ? "" : char;
    }
    columns.push(currentCol);
    return columns.map((col) => col.trim().replace(/^"|"$/g, ""));
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
        document.dispatchEvent(new CustomEvent('ProjectsDataLoaded'));

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
