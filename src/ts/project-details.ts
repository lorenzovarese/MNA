import { Project, ProjectMetadata } from "./get-projects";

enum Languages {
    EN = 'EN',
    DE = 'DE',
    IT = 'IT',
}

type TableLabelTranslations = Map<Languages, Map<string, string>>;

const tableLabelTranslations: TableLabelTranslations = new Map([
    [Languages.EN, new Map([
        ["Project", "Project"],
        ["Title", "Title"],
        ["Category", "Category"],
        ["Program", "Program"],
        ["Country", "Country"],
        ["City", "City"],
        ["Street", "Street"],
        ["Number", "Number"],
        ["Canton/Region", "Canton/Region"],
        ["Zip Code", "Zip Code"],
        ["GPS", "GPS"],
        ["Year", "Year"],
        ["Project Number", "Project Number"],
        ["CAD Number", "CAD Number"],
        ["Client", "Client"],
        ["Building Costs", "Building Costs"],
        ["Deepness", "Deepness"],
        ["Phase", "Phase"],
        ["Subphase", "Subphase"],
        ["Sea Elevation", "Sea Elevation"]
    ])],
    [Languages.DE, new Map([
        ["Project", "Projekt"],
        ["Title", "Titel"],
        ["Category", "Kategorie"],
        ["Program", "Programm"],
        ["Country", "Land"],
        ["City", "Stadt"],
        ["Street", "Straße"],
        ["Number", "Nummer"],
        ["Canton/Region", "Kanton/Region"],
        ["Zip Code", "Postleitzahl"],
        ["GPS", "GPS"],
        ["Year", "Jahr"],
        ["Project Number", "Projektnummer"],
        ["CAD Number", "CAD-Nummer"],
        ["Client", "Klient"],
        ["Building Costs", "Baukosten"],
        ["Deepness", "Tiefe"],
        ["Phase", "Phase"],
        ["Subphase", "Teilphase"],
        ["Sea Elevation", "Meereshöhe"]
    ])],
    [Languages.IT, new Map([
        ["Project", "Progetto"],
        ["Title", "Titolo"],
        ["Category", "Categoria"],
        ["Program", "Programma"],
        ["Country", "Paese"],
        ["City", "Città"],
        ["Street", "Via"],
        ["Number", "Numero"],
        ["Canton/Region", "Cantone/Regione"],
        ["Zip Code", "Codice Postale"],
        ["GPS", "GPS"],
        ["Year", "Anno"],
        ["Project Number", "Numero del Progetto"],
        ["CAD Number", "Numero CAD"],
        ["Client", "Cliente"],
        ["Building Costs", "Costi di Costruzione"],
        ["Deepness", "Profondità"],
        ["Phase", "Fase"],
        ["Subphase", "Sottofase"],
        ["Sea Elevation", "Elevazione del mare"]
    ])]
]);


// Change the document title
function changeTitle(newTitle: string): void {
    document.title = newTitle;
}

// Get project number from the URL query parameters
function getProjectNumberFromURL(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("projectNumber");
}

// Generate the HTML for the thumbnail image
function generateThumbnail(project: ProjectMetadata): string {
    const thumbnailSrc = `../assets/projects/${project.projectNumber}/img/thumbnail.jpg`;
    return `<img src="${thumbnailSrc}" alt="Thumbnail" width="560"><br>`;
}

// Generate the HTML for the project details table
function generateTableHTML(project: Project, selectedLanguage: Languages): string {
    console.log("selectedLanguage", selectedLanguage);

    // Retrieve the map of labels for the selected language
    const labels = tableLabelTranslations.get(selectedLanguage);

    // Iterate over the project object and generate the table rows
    const tableRows = Object.entries(project).map(([key, value]) => {
        //Convert from camel case to Capital Case the Project keys
        key = camelToCapitalCase(key);

        // Check if a label exists for this key in the selected language; if not, use the key itself
        const label = labels?.get(key) || key;

        // Only create a table row if the value is defined
        if (value !== undefined && value !== null) {
            return `<tr><td><strong>${label}:</strong></td><td>${value}</td></tr>`;
        }
        return "";
    }).filter(row => row !== "").join("");

    return `<table>${tableRows}</table><br>`;
}

// From camel case to Capital Case
function camelToCapitalCase(text: string): string {
    return text.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
}


// Generate the HTML for the image carousel
function generateCarouselHTML(projectNumber: string, imagesCount: number): string {
    if (imagesCount === 0) {
        return "<p>No images found for this project.</p>";
    }

    const carouselItemsHTML = Array.from({ length: imagesCount }, (_, i) => {
        const imagePath = `../assets/projects/${projectNumber}/img/image${i + 1}.webp`;
        return `<div class="carousel-item${i === 0 ? " active" : ""}" data-index="${i + 1}">
            <img src="${imagePath}" alt="Project Image ${i + 1}" width="560">
        </div>`;
    }).join("");

    return `
        <h2>Gallery</h2>
        <div class="carousel">
            <div class="carousel-inner">${carouselItemsHTML}</div>
            <button class="carousel-button left">←</button>
            <button class="carousel-button right">→</button>
        </div><br>
    `;
}

// Setup carousel navigation
function setupCarouselNavigation(): void {
    const leftButton = document.querySelector(".carousel-button.left") as HTMLButtonElement;
    const rightButton = document.querySelector(".carousel-button.right") as HTMLButtonElement;
    const items = document.querySelectorAll(".carousel-item");
    if (!leftButton || !rightButton || items.length === 0) {
        console.error("Carousel elements not found.");
        return;
    }

    let activeIndex = 0;

    const updateCarousel = (newIndex: number): void => {
        items[activeIndex].classList.remove("active");
        items[newIndex].classList.add("active");
        activeIndex = newIndex;
    };

    leftButton.addEventListener("click", () => {
        const newIndex = (activeIndex - 1 + items.length) % items.length;
        updateCarousel(newIndex);
    });

    rightButton.addEventListener("click", () => {
        const newIndex = (activeIndex + 1) % items.length;
        updateCarousel(newIndex);
    });
}

// Generate the HTML for the project video
function generateVideoHTML(projectMetadata: ProjectMetadata): string {
    if (projectMetadata.youtubeVideoLink) {
        const videoId = projectMetadata.youtubeVideoLink.split("v=")[1].split("&")[0];
        return `<h2>Video</h2>
            <div class="youtube-video-container" style="margin-top: 20px;">
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div><br>`;
    }
    return "";
}

// Generate the HTML for the project board download link
function generateProjectBoardHTML(projectMetadata: ProjectMetadata, projectNumber: string): string {
    if (projectMetadata.projectboard === "Yes") {
        const projectboardPath = `public/projects/${projectNumber}/doc/projectboard.pdf`;
        return `<h2>Project Board</h2>
            <a href="${projectboardPath}" download style="display: inline-block; padding: 8px 15px; color: #000; text-decoration: none; border: 1px solid #000; font-size: 16px;">
                Download Project Board &#x1F4E5;
            </a><br>`;
    }
    return "";
}


// Example conversion of displayProjectDetails to TypeScript
function displayProjectDetails(project: Project, projectMetadata: ProjectMetadata): void {

    if (project && projectMetadata) {
        //Retrieve language from local storage
        const selectedLang = localStorage.getItem("selectedLanguage") as Languages || Languages.EN; // Default to English
        const container = document.getElementById("project-details-container") as HTMLElement;
        const title = `<h1>${project.project}</h1>`;
        const thumbnailHTML = generateThumbnail(projectMetadata);
        const tableHTML = generateTableHTML(project, selectedLang);
        const carouselHTML = generateCarouselHTML(project.projectNumber.toString(), projectMetadata.numberOfImages);
        const videoHTML = generateVideoHTML(projectMetadata);
        const projectboardHTML = generateProjectBoardHTML(projectMetadata, project.projectNumber.toString());
        container.innerHTML = `${title}${thumbnailHTML}${tableHTML}${carouselHTML}${videoHTML}${projectboardHTML}`;
    } else {
        const container = document.getElementById("project-details-container") as HTMLElement;
        container.innerText = "Project not found.";
    }
}

function loadContent(): void {
    document.addEventListener("DOMContentLoaded", () => {
        const projectNumberString = getProjectNumberFromURL();
        const projectNumber = projectNumberString ? parseInt(projectNumberString, 10) : null;

        if (!projectNumber) {
            console.error('Invalid or missing project number in URL.');
            return;
        }

        // Retrieve and parse project data and metadata from local storage
        const projectsDataString = localStorage.getItem("projectsData");
        const projectsMetadataString = localStorage.getItem("projectsMetadata");

        const projectsData: { [key: number]: Project } = projectsDataString ? JSON.parse(projectsDataString) : {};
        const projectsMetadata: { [key: number]: ProjectMetadata } = projectsMetadataString ? JSON.parse(projectsMetadataString) : {};

        // Access specific project and metadata using the parsed project number directly
        const projectData = projectsData[projectNumber];
        const projectMetadata = projectsMetadata[projectNumber];

        if (projectData && projectMetadata) {
            changeTitle("MNA - " + projectData.project);
            displayProjectDetails(projectData, projectMetadata);
            setupCarouselNavigation();
        } else {
            console.error(`Project ${projectNumber} not found or data is incomplete.`);
            const container = document.getElementById("project-details-container") as HTMLElement;
            container.innerText = "Project not found or data is incomplete.";
        }
    });
}

loadContent();

