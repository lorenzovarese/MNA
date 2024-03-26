// Base interface with projectNumber property
interface BaseProject {
    projectNumber: number; 
}

interface Project extends BaseProject {
    project: string;
    title: string;
    category: string;
    program: string | null;
    country: string | null;
    city: string | null;
    street: string | null;
    number: string | null;
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

interface ProjectMetadata extends BaseProject {
    project: string;
    year: number;
    projectNumber: number;
    numberOfImages: number;
    youtubeVideoLink: string;
    projectboard: string;
}

// Generic function to parse CSV data into a dictionary
function parseCsvToDict<T extends BaseProject>(csvData: string, processRow: (columns: string[]) => T): Record<string, T> {
    let dict: Record<string, T> = {};

    try {
        const rows = csvData.trim().split("\n");
        rows.slice(1).forEach(row => {
            const columns = parseCsvLine(row);
            const item = processRow(columns);
            // Use the projectNumber as the key, ensuring it's a string
            dict[item.projectNumber.toString()] = item;
        });
    } catch (error) {
        console.error("Error parsing CSV data:", error);
        return {};
    }

    return dict;
}

// Parses a single line of CSV data into an array of strings
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

// Generic function to fetch and store data
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

// Usage example for fetching and storing projects data
fetchAndStore<Project>("../assets/data/02_projects.csv", "projectsData", columns => ({
    project: columns[0],
    title: columns[1],
    category: columns[2],
    program: columns[3] || null,
    country: columns[4] || null,
    city: columns[5] || null,
    street: columns[6] || null,
    number: columns[7] || null,
    cantonRegion: columns[8] || null,
    zipCode: columns[9] || null,
    GPS: columns[10] || null,
    year: parseInt(columns[11], 10),
    projectNumber: parseInt(columns[12], 10), // Ensure this is a number
    cadNum: columns[13] || null,
    client: columns[14] || null,
    buildingCosts: columns[15] || null,
    deepness: columns[16] || null,
    phase: columns[17] || null,
    subphase: columns[18] || null,
    seaElevation: columns[19] || null,
}));

// Usage example for fetching and storing project media data
fetchAndStore<ProjectMetadata>("../assets/data/02_projects_media.csv", "projectsMetadata", columns => ({
    project: columns[0],
    year: parseInt(columns[1], 10),
    projectNumber: parseInt(columns[2], 10),
    numberOfImages: parseInt(columns[3], 10),
    youtubeVideoLink: columns[4],
    projectboard: columns[5],
}));
