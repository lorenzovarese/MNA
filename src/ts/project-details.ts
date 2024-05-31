import { Project, ProjectMetadata } from "./interfaces/project-interfaces";
declare var lightGallery: any;

interface categoryColorMapping {
  title: string;
  color: string;
}

const categoryColors: categoryColorMapping[] = [
  { title: "urban planning", color: "#a9d252" },
  { title: "single building", color: "#93dbe0" },
  { title: "transformation", color: "#ffadc3" },
  { title: "interior work", color: "#ffa937" },
  { title: "installation", color: "#ffce36" },
  { title: "default", color: "#f0f0f0" },
];

// Function to get URL parameters
function getQueryParam(param: string): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to load project description from a file
async function loadProjectDescription(projectNumber: number) {
  const selectedLanguage = localStorage.getItem("selectedLanguage") || "en"; // Default to English
  const url = `../assets/projects/${projectNumber}/global/doc/${selectedLanguage}_desc.txt`;
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

// Function to populate the project details
function populateProjectDetails(project: Project, metadata: ProjectMetadata) {
  document.querySelector<HTMLTitleElement>(
    "title"
  )!.textContent = `${project.title} Project`;
  document.querySelector<HTMLImageElement>(
    ".img-overlay"
  )!.src = `../assets/projects/${project.projectNumber}/global/img/thumbnail.jpg`;
  document.querySelector<HTMLImageElement>(".img-overlay")!.alt = project.title;
  document.querySelector<HTMLElement>(".overlay-text")!.textContent =
    project.title;

  const descriptionSection = document.getElementById(
    "project-description"
  ) as HTMLElement;
  const tableContainer = document.querySelector(
    ".table-container"
  ) as HTMLElement;

  const categoryColor = categoryColors.find(
    (entry) => entry.title === project.category
  )?.color;
  if (categoryColor) {
    descriptionSection.style.backgroundColor = categoryColor;
    tableContainer.style.borderColor = categoryColor;
  }

  const table = document.querySelector<HTMLTableElement>("table")!;
  table.innerHTML = `
        <tr><td>Project:</td><td>${project.project}</td></tr>
        <tr><td>Title:</td><td>${project.title}</td></tr>
        <tr><td>Category:</td><td>${project.category}</td></tr>
        <tr><td>Program:</td><td>${project.program}</td></tr>
        <tr><td>Country:</td><td>${project.country}</td></tr>
        <tr><td>City:</td><td>${project.city}</td></tr>
        <tr><td>Street:</td><td>${project.street}</td></tr>
        <tr><td>Canton Region:</td><td>${project.cantonRegion}</td></tr>
        <tr><td>Zip Code:</td><td>${project.zipCode}</td></tr>
        <tr><td>GPS:</td><td>${project.GPS}</td></tr>
        <tr><td>Year:</td><td>${project.year}</td></tr>
        <tr><td>Project Number:</td><td>${project.projectNumber}</td></tr>
        <tr><td>Client:</td><td>${project.client}</td></tr>
        <tr><td>Building Costs:</td><td>${project.buildingCosts}</td></tr>
        <tr><td>Deepness:</td><td>${project.deepness}</td></tr>
        <tr><td>Phase:</td><td>${project.phase}</td></tr>
        <tr><td>Subphase:</td><td>${project.subphase}</td></tr>
    `;
}

// Function to populate media details
function populateMediaDetails(metadata: ProjectMetadata) {
  // Populate phase specific thumbnail
  const phaseImage = document.getElementById("phase-image") as HTMLImageElement;
  const phaseText = document.getElementById(
    "phase-name"
  ) as HTMLTextAreaElement;
  const downloadButton = document.querySelector('#projectboard-button') as HTMLLinkElement;

  phaseText.textContent = `Phase ${metadata.phase}`;
  phaseImage.src = `../assets/projects/${metadata.projectNumber}/phase${metadata.phase}/img/thumbnail.jpg`;
  phaseImage.alt = `Phase ${metadata.phase} Thumbnail`;

  // Toggle the visibility of the download button based on projectboard availability
  if (metadata.projectboard) {
    downloadButton.style.display = 'block'; // Show if projectboard is true
    downloadButton.href = `../assets/projects/${metadata.projectNumber}/phase${metadata.phase}/doc/projectboard.pdf`;
} else {
    downloadButton.style.display = 'none'; // Hide if false
}

  const gallery = document.querySelector(".image-gallery")!;
  gallery.innerHTML = "";
  for (let i = 1; i <= metadata.numberOfImages; i++) {
    const link = document.createElement("a");
    link.href = `../assets/projects/${metadata.projectNumber}/phase${metadata.phase}/img/image${i}.webp`;
    link.classList.add("gallery-item");

    const img = document.createElement("img");
    img.src = link.href;
    img.alt = `Gallery Image ${i}`;

    link.appendChild(img);
    gallery.appendChild(link);
  }

  if (metadata.youtubeVideoLink) {
    const iframe = document.querySelector<HTMLIFrameElement>(".video")!;
    iframe.src = metadata.youtubeVideoLink;
  }

  initializeLightGallery(); // Initialize the lightGallery on the updated gallery
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

// Main function to orchestrate the dynamic population of the page
async function main() {
  const projectNumber = getQueryParam("projectNumber");
  const phase = getQueryParam("phase");

  if (!projectNumber || !phase) {
    console.error("Missing URL parameters.");
    return;
  }

  const projectsData = JSON.parse(localStorage.getItem("projectsData")!);
  const projectsMetadata = JSON.parse(
    localStorage.getItem("projectsMetadata")!
  );

  const project = projectsData[projectNumber];
  const metadata = projectsMetadata[`${projectNumber}-${phase}`];

  if (project && metadata) {
      populateProjectDetails(project, metadata);
      populateMediaDetails(metadata);
      loadProjectDescription(project.projectNumber); // Load the project description from file
  } else {
    console.error("Project or metadata not found.");
  }

  setupLanguageDropdown();
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
