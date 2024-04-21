import { BaseProject, Project, ProjectMetadata } from "./interfaces/project-interfaces";

/**
 * Parses a CSV string into a dictionary of objects based on the provided row processing function.
 * @param {string} csvData - The CSV file content as a string.
 * @param {(columns: string[]) => T} processRow - A function to process each row into an object of type T.
 * @returns {Record<string, T>} A dictionary of objects indexed by the project number.
 */
function parseCsvToDict<T extends BaseProject>(csvData: string, processRow: (columns: string[]) => T): Record<string, T> {
    let dict: Record<string, T> = {};

    try {
        const rows = csvData.trim().split("\n");
        rows.slice(1).forEach(row => {
            const columns = parseCsvLine(row);
            const item = processRow(columns);
            dict[item.projectNumber.toString()] = item;
        });
    } catch (error) {
        console.error("Error parsing CSV data:", error);
        return {};
    }

    return dict;
}

/**
 * Parses a single line of CSV data into an array of strings, handling quoted sections and commas correctly.
 * @param {string} text - A single line of CSV data.
 * @returns {string[]} An array of values derived from the CSV line.
 */
function parseCsvLine(text: string): string[] {
    let columns: string[] = [];
    let currentCol = "";
    let inQuotes = false;
    let charPrev = "";
    for (const char of text) {
        if (char === '"' && charPrev !== '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
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
 * @param {string} storageKey - Local storage key under which the data will be stored.
 * @param {(columns: string[]) => T} processRow - Function to convert CSV rows into object of type T.
 * @template T Extends BaseProject indicating the type of the data to fetch and store.
 */
async function fetchAndStore<T extends BaseProject>(url: string, storageKey: string, processRow: (columns: string[]) => T): Promise<void> {
    if (localStorage.getItem(storageKey)) {
        console.log(`${storageKey} data already loaded.`);
        return;
    }
    try {
        const response = await fetch(url);
        const csvData = await response.text();
        const data = parseCsvToDict(csvData, processRow);
        localStorage.setItem(storageKey, JSON.stringify(data));
        console.log(`${storageKey} data loaded and stored.`);
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
    await fetchAndStore<Project>("../assets/data/02_projects.csv", "projectsData", columns => ({
        project: columns[0],
        title: columns[1],
        category: columns[2],
        program: columns[3] || null,
        country: columns[4] || null,
        city: columns[5] || null,
        street: columns[6] || null,
        houseNumber: columns[7] || null,
        cantonRegion: columns[8] || null,
        zipCode: columns[9] || null,
        GPS: columns[10] || null,
        year: parseInt(columns[11], 10),
        projectNumber: parseInt(columns[12], 10),
        cadNum: columns[13] || null,
        client: columns[14] || null,
        buildingCosts: columns[15] || null,
        deepness: columns[16] || null,
        phase: columns[17] || null,
        subphase: columns[18] || null,
        seaElevation: columns[19] || null,
    }));

    // Fetching and storing project media data
    await fetchAndStore<ProjectMetadata>("../assets/data/02_projects_media.csv", "projectsMetadata", columns => ({
        project: columns[0],
        year: parseInt(columns[1], 10),
        projectNumber: parseInt(columns[2], 10),
        numberOfImages: parseInt(columns[3], 10),
        youtubeVideoLink: columns[4],
        projectboard: columns[5],
    }));
}

// Execute main function
main();
