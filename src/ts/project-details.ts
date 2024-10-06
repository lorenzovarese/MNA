import { Project, ProjectMetadata } from "./interfaces/project-interfaces";
declare var lightGallery: any;

const projectsFolder: String = '../assets/projects'

export const categoryColors: Record<string, string> = {
    "activity": "#ffffff",
    "urban planning": "#a9d252",
    "single building": "#93dbe0",
    "transformation": "#ffadc3",
    "interior work": "#ffa937",
    "installation": "#ffce36",
    "default": "#f0f0f0"
};

// #region Translation
export interface Translations {
    en: Record<string, string>;
    de: Record<string, string>;
    it: Record<string, string>;
}

export const translations: Translations = {
    en: {
        "Project": "Project",
        "Title": "Title",
        "Category": "Category",
        "Program": "Program",
        "Country": "Country",
        "City": "City",
        "Street": "Street",
        "Canton Region": "Canton Region",
        "Zip Code": "Zip Code",
        "Year": "Year",
        "Project Number": "Project Number",
        "Client": "Client",
        "Building Costs": "Building Costs",
        "Deepness": "Deepness",
        "Phase": "Phase",
        "Subphase": "Subphase",
    },
    de: {
        "Project": "Projekt",
        "Title": "Titel",
        "Category": "Kategorie",
        "Program": "Programm",
        "Country": "Land",
        "City": "Stadt",
        "Street": "Straße",
        "Canton Region": "Kanton/Region",
        "Zip Code": "Postleitzahl",
        "Year": "Jahr",
        "Project Number": "Projektnummer",
        "Client": "Kunde",
        "Building Costs": "Baukosten",
        "Deepness": "Tiefe",
        "Phase": "Phase",
        "Subphase": "Teilphase"
    },
    it: {
        "Project": "Progetto",
        "Title": "Titolo",
        "Category": "Categoria",
        "Program": "Programma",
        "Country": "Paese",
        "City": "Città",
        "Street": "Via",
        "Canton Region": "Cantone/Regione",
        "Zip Code": "Codice Postale",
        "Year": "Anno",
        "Project Number": "Numero del Progetto",
        "Client": "Cliente",
        "Building Costs": "Costi di Costruzione",
        "Deepness": "Profondità",
        "Phase": "Fase",
        "Subphase": "Sottofase"
    }    
};

export function translate(key: string): string {
    const selectedLanguage = localStorage.getItem("selectedLanguage") || "en";
    const translationDictionary = translations[selectedLanguage as keyof Translations] || translations.en;
    
    if (key in translationDictionary) {
        return translationDictionary[key];
    } else {
        console.warn(`Translation key "${key}" not found in "${selectedLanguage}" dictionary.`);
        return translations.en[key] || key; // Fallback to English or the key itself
    }
}

// #endregion Translation

// Function to get URL parameters
function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to load project description from a file
async function loadProjectDescription(projectNumber: number) {
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en"; // Default to English
  const url = `${projectsFolder}/${projectNumber}/global/doc/${selectedLanguage}_desc.txt`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch description");
    }
    const text = await response.text();
    const descriptionSection = document.getElementById(
      "project-description"
    ) as HTMLElement;
    descriptionSection.textContent = text;
  } catch (error) {
    console.error("Error fetching project description:", error);
    const descriptionSection = document.getElementById(
      "project-description"
    ) as HTMLElement;
    descriptionSection.style.display = "none"; // Hide the section if there is an error
  }
}

/**
 * Initializes an OpenStreetMap (OSM) map with given latitude, longitude, and a project title.
 *
 * @param {number | null} latitude - Latitude of the project location or null if not available.
 * @param {number | null} longitude - Longitude of the project location or null if not available.
 * @param {string} projectTitle - Title of the project to display on the map marker.
 */
function initializeOSMMap(latitude: number | null, longitude: number | null, projectTitle: string) {
    if (latitude === null || longitude === null) {
        console.error('GPS coordinates are not available or invalid.');
        return;
    }

    // Initialize the map with the provided latitude and longitude
    const map = L.map('osm-map').setView([latitude, longitude], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add a marker at the provided coordinates and bind the project title to a popup
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(projectTitle)
        .openPopup();
}

/**
 * Function to populate the project details for common information
 *
 * @param {Project} project - The project data.
 * @param {ProjectMetadata} metadata - The metadata related to the project.
 */
function populateProjectCommon(project: Project, metadata: ProjectMetadata) {
    const projectIdPadded = project.projectId.toString().padStart(3, '0');
    const commonFolder: string = `${projectsFolder}/${metadata.projectName}/${projectIdPadded}.00_common`;
    const imgOverlay = document.querySelector<HTMLImageElement>(".img-overlay");
    const imgOverlayContainer = document.querySelector<HTMLDivElement>(".image-overlay-container");

    document.querySelector<HTMLTitleElement>("title")!.textContent = `${project.title} Project`;
    
    if (imgOverlay) {
        if (metadata.common.covers) {
            // If image cover exists, display the cover image
            imgOverlay.src = `${commonFolder}/${projectIdPadded}.00.01_covers/${projectIdPadded}.00.01_cover_wide.webp`;
            imgOverlay.alt = project.title;
        } else if (imgOverlayContainer) {
            // If no image cover exists and imgOverlayContainer is found, apply a fallback color based on the project category
            const fallbackColor = categoryColors[project.category] || categoryColors["default"];
            imgOverlayContainer.style.backgroundColor = fallbackColor;
        }
    }else{
        console.error("Image overlay not found")
    }

    document.querySelector<HTMLElement>(".overlay-text")!.textContent = project.title;

  const descriptionSection = document.getElementById(
    "project-description"
  ) as HTMLElement;
  const tableWrapper = document.querySelector(
    ".table-wrapper"
  ) as HTMLElement;

  const categoryColor = categoryColors[project.category];
  if (categoryColor) {
    descriptionSection.style.backgroundColor = categoryColor;
    tableWrapper.style.borderColor = categoryColor;
    tableWrapper.style.borderWidth = "5px";
  }

  const table = document.querySelector<HTMLTableElement>("table")!;
    table.innerHTML = `
        <tr><td>${translate('Project')}:</td><td>${project.projectName}</td></tr>
        <tr><td>${translate('Title')}:</td><td>${project.title}</td></tr>
        <tr><td>${translate('Category')}:</td><td>${project.category}</td></tr>
        <tr><td>${translate('Program')}:</td><td>${project.program}</td></tr>
        <tr><td>${translate('Country')}:</td><td>${project.country}</td></tr>
        <tr><td>${translate('City')}:</td><td>${project.city}</td></tr>
        <tr><td>${translate('Street')}:</td><td>${project.street}</td></tr>
        <tr><td>${translate('Canton Region')}:</td><td>${project.cantonRegion}</td></tr>
        <tr><td>${translate('Zip Code')}:</td><td>${project.zipCode}</td></tr>
        <tr><td>${translate('Year')}:</td><td>${project.year}</td></tr>
        <tr><td>${translate('Project Number')}:</td><td>${project.projectId}</td></tr>
        <tr><td>${translate('Client')}:</td><td>${project.client}</td></tr>
        <tr><td>${translate('Building Costs')}:</td><td>${project.buildingCosts}</td></tr>
        <tr><td>${translate('Phase')}:</td><td>${project.phases}</td></tr>
        <tr><td>${translate('Subphase')}:</td><td>${project.subphase}</td></tr>
    `;
    if (project && project.gps && project.title) {
        initializeOSMMap(project.gps["latitude"], project.gps["longitude"], project.title);
    }
}

// Function to populate media details
function populateMediaDetails(metadata: ProjectMetadata) {
  // Populate phase specific thumbnail
  const phaseImage = document.getElementById("phase-image") as HTMLImageElement;
  return;
//   const phaseText = document.getElementById(
//     "phase-name"
//   ) as HTMLTextAreaElement;
//   const downloadButton = document.querySelector('#projectboard-button') as HTMLLinkElement;

//   const phaseFolder: String = `${projectsFolder}/${metadata.projectNumber}/phase${metadata.phase}`

//   phaseText.textContent = `Phase ${metadata.phase}`;
//   phaseImage.src = `${phaseFolder}/img/thumbnail.jpg`;
//   phaseImage.alt = `Phase ${metadata.phase} Thumbnail`;

//   // Toggle the visibility of the download button based on projectboard availability
//   if (metadata.projectboard) {
//     downloadButton.style.display = 'block'; // Show if projectboard is true
//     downloadButton.href = `${phaseFolder}/doc/projectboard.pdf`;
// } else {
//     downloadButton.style.display = 'none'; // Hide if false
// }

//   const gallery = document.querySelector(".image-gallery")!;
//   gallery.innerHTML = "";
//   for (let i = 1; i <= metadata.numberOfImages; i++) {
//     const link = document.createElement("a");
//     link.href = `${phaseFolder}/img/image${i}.webp`;
//     link.classList.add("gallery-item");

//     const img = document.createElement("img");
//     img.src = link.href;
//     img.alt = `Gallery Image ${i}`;

//     link.appendChild(img);
//     gallery.appendChild(link);
//   }

//   const youtubeIframe = document.getElementById("project-video")! as HTMLIFrameElement;
//   if (metadata.youtubeVideoLink) {
//     youtubeIframe.src = metadata.youtubeVideoLink;
//   }
//   else{
//     youtubeIframe.style.display='none';
//   }

//   initializeLightGallery(); // Initialize the lightGallery on the updated gallery
}

// Initialize lightGallery on the gallery element
function initializeLightGallery() {
  const galleryElement = document.getElementById("project-gallery");
  lightGallery(galleryElement, {
    selector: ".gallery-item",
    download: false, // Disable download button
    zoom: true,
    actualSize: true,
    share: false, // Disable sharing buttons
  });
}

function addTableExtensionListeners(): void {
    const expandBtn = document.getElementById("expandTable") as HTMLButtonElement | null;
    const collapseBtn = document.getElementById("collapseTable") as HTMLButtonElement | null;
    const tableWrapper = document.querySelector(".table-wrapper") as HTMLElement | null;

    // Check if the elements exist in the DOM to prevent runtime errors
    if (!expandBtn || !collapseBtn || !tableWrapper) {
        console.error("One or more essential elements are missing!");
        return;
    }

    expandBtn.addEventListener("click", () => {
        tableWrapper.style.maxHeight = "100vh";
        expandBtn.style.display = "none";
        collapseBtn.style.display = "block";
        tableWrapper.classList.add("expanded");
    });

    collapseBtn.addEventListener("click", () => {
        tableWrapper.style.maxHeight = "30vh";
        expandBtn.style.display = "block";
        collapseBtn.style.display = "none";
        tableWrapper.classList.remove("expanded");
    });
}

// Main function to orchestrate the dynamic population of the page
async function main() {
  const projectNumber = getQueryParam("projectNumber");
  const phase = getQueryParam("phase");

  if (!projectNumber) {
    console.error("Missing project number in the URL parameter.");
    return;
  }

  const projectsData = JSON.parse(localStorage.getItem("projectsData")!);
  const projectsMetadata = JSON.parse(
    localStorage.getItem("projectsMetadata")!
  );

  const project = projectsData[projectNumber];
  const metadata = projectsMetadata[projectNumber];

  if (project && metadata) {
      populateProjectCommon(project, metadata);
      populateMediaDetails(metadata);
      loadProjectDescription(project.projectNumber);
  } else {
    console.error("Project or metadata not found.");
  }

  setupLanguageDropdown();
  addTableExtensionListeners();
}

function setupLanguageDropdown() {
    const languageIcon = document.getElementById("language-icon");
    const dropdown = document.getElementById("language-dropdown") as HTMLElement;

    // Set initial state of dropdown based on local storage or default to hide
    dropdown.style.display = "none"; // Default hide

    // Toggle dropdown visibility on icon click
    languageIcon?.addEventListener("click", () => {
        dropdown.style.display = (dropdown.style.display === "none" ? "block" : "none");
    });

    // Set click events on language options
    document.querySelectorAll(".language-option").forEach(option => {
        option.addEventListener("click", function(this: HTMLElement) {
            const selectedLanguage = this.getAttribute("data-lang");
            localStorage.setItem("selectedLanguage", selectedLanguage!);
            dropdown.style.display = "none"; // Hide dropdown after selection
            window.location.reload(); // Refresh to apply language
        });
    });
}

document.addEventListener("DOMContentLoaded", main);
