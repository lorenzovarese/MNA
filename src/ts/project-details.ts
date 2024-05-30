import { Project, ProjectMetadata } from './interfaces/project-interfaces';

// Function to get URL parameters
function getQueryParam(param: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to populate the project details
function populateProjectDetails(project: Project) {
    document.querySelector<HTMLTitleElement>('title')!.textContent = `${project.title} Project`;
    document.querySelector<HTMLImageElement>('.img-overlay')!.src = `../assets/projects/${project.projectNumber}/global/img/thumbnail.jpg`;
    document.querySelector<HTMLImageElement>('.img-overlay')!.alt = project.title;
    document.querySelector<HTMLElement>('.overlay-text')!.textContent = project.title;

    const table = document.querySelector<HTMLTableElement>('table')!;
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
    const phaseImage = document.getElementById('phase-image') as HTMLImageElement;
    const phaseText = document.getElementById('phase-name') as HTMLTextAreaElement
    phaseText.textContent = `Phase ${metadata.phase}`;
    phaseImage.src = `../assets/projects/${metadata.projectNumber}/phase${metadata.phase}/img/thumbnail.jpg`;
    phaseImage.alt = `Phase ${metadata.phase} Thumbnail`;

    const gallery = document.querySelector('.image-gallery')!;
    gallery.innerHTML = '';
    for (let i = 1; i <= metadata.numberOfImages; i++) {
        const img = document.createElement('img');
        img.src = `../assets/projects/${metadata.projectNumber}/phase${metadata.phase}/img/image${i}.webp`;
        img.alt = `Gallery Image ${i}`;
        gallery.appendChild(img);
    }

    if (metadata.youtubeVideoLink) {
        const iframe = document.querySelector<HTMLIFrameElement>('.video')!;
        iframe.src = metadata.youtubeVideoLink;
    }
}

// Main function to orchestrate the dynamic population of the page
async function main() {
    const projectNumber = getQueryParam('projectNumber');
    const phase = getQueryParam('phase');

    if (!projectNumber || !phase) {
        console.error('Missing URL parameters.');
        return;
    }

    const projectsData = JSON.parse(localStorage.getItem('projectsData')!);
    const projectsMetadata = JSON.parse(localStorage.getItem('projectsMetadata')!);

    const project = projectsData[projectNumber];
    const metadata = projectsMetadata[`${projectNumber}-${phase}`];

    if (project && metadata) {
        populateProjectDetails(project);
        populateMediaDetails(metadata);
    } else {
        console.error('Project or metadata not found.');
    }
}

document.addEventListener('DOMContentLoaded', main);