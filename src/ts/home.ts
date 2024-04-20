
interface Project {
    project: string; // mandatory
    title: string; // mandatory
    category: string; // mandatory
    program: string | null;
    country: string | null;
    city: string | null;
    street: string | null;
    number: string | null;
    cantonRegion: string | null;
    zipCode: string | null;
    GPS: string | null;
    year: number; // mandatory
    projectNumber: number;
    cadNum: string | null;
    client: string | null;
    buildingCosts: string | null;
    deepness: string | null;
    phase: string | null;
    subphase: string | null;
    seaElevation: string | null;
}

interface PageInformation {
    name: string;
    iconFileName?: string;
    link: string;
}

interface LegendEntry {
    title: string;
    color: string;
}

interface PopupData {
    type: 'project' | 'legend' | 'menu' | 'languages' | 'blog' | 'sorting';
    x: number;
    y: number;
}

interface ProjectData extends PopupData {
    projectNumber: number;
    title: string;
    category: string;
    year: number;
}

interface NavigationData extends PopupData {
    pages: PageInformation[];
}

interface LegendData extends PopupData {
    entries: LegendEntry[];
}

interface LanguageData extends PopupData {
    languages: Languages[];
}

interface SortingData extends PopupData {
    options: SortingOptions[];
}

enum Languages {
    EN = 'EN',
    DE = 'DE',
    IT = 'IT',
}

enum SortingOptions {
    NUMBER = 'number',
    COLOUR = 'colour',
    PROGRAM = 'program',
    PHASE = 'phase',
}

/**
 * Creates squares for each project in the provided data object and appends them to the squares container.
 * 
 * @param data - The data object containing project information.
 */
function createSquares(data: Record<string, Project>, sortOrder: SortingOptions = SortingOptions.NUMBER): void {
    const container = document.querySelector('.squares-container') as HTMLDivElement;
    if (!container) return; // Guard to ensure container exists

    container.innerHTML = ''; // Clear existing squares before adding new ones

    const projectsArray: Project[] = sortProjects(Object.values(data), sortOrder);

    insertProjectSquares(container, projectsArray);
    insertSocialSquares(container, projectsArray.length);
    insertControlSquares(container);
    insertPlaceholderSquares(container);

    let lastWindowWidth = window.innerWidth;

    window.addEventListener('resize', debounce(() => {
        const currentWindowWidth = window.innerWidth;
        if (currentWindowWidth !== lastWindowWidth) { // Check if the width has changed
            insertPlaceholderSquares(container);
            lastWindowWidth = currentWindowWidth; // Update the last known width
        }
    }, 100));
}

function sortProjects(projectsArray: Project[], sortOrder: SortingOptions): Project[] {
    // Sort logic here depends on what 'sortOrder' actually represents in your data
    return projectsArray.sort((a, b) => {
        switch (sortOrder) {
            case SortingOptions.NUMBER:
                return a.projectNumber - b.projectNumber;
            case SortingOptions.COLOUR:
                return a.category.localeCompare(b.category);
            case SortingOptions.PROGRAM:
                if (!a.program) return 0;
                return a.program.localeCompare(b.program || '');
            case SortingOptions.PHASE:
                if (!a.phase || !b.phase) return 0;
                return (a.phase || '').localeCompare(b.phase || '');
            default:
                return 0;
        }
    });
}


//#region Helper functions

function getRandomPosition(startIndex: number, endIndex: number): number {
    return Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
}

function getRandomPositions(startIndex: number, endIndex: number, count: number): number[] {
    const positions = new Set<number>();
    while (positions.size < count) {
        positions.add(getRandomPosition(startIndex, endIndex));
    }
    return Array.from(positions);
}

function insertRandomElement(container: HTMLDivElement, createDiv: (index: number) => HTMLDivElement, randomPosition: number, index: number): void {
    const newDiv = createDiv(index);
    const insertBeforeNode = container.children[randomPosition] || null;
    container.insertBefore(newDiv, insertBeforeNode);
}

function insertRandomElements(container: HTMLDivElement, createDiv: (index: number) => HTMLDivElement, insertCount: number, startIndex: number, endIndex: number): void {
    const randomPositions = getRandomPositions(startIndex, endIndex, insertCount);

    randomPositions.forEach((position, index) => {
        const newDiv = createDiv(index);
        const insertBeforeNode = container.children[position] || null;
        container.insertBefore(newDiv, insertBeforeNode);
    });
}

//#endregion

function insertProjectSquares(container: HTMLDivElement, projectsArray: Project[]): void {
    // Create squares for all projects
    projectsArray.forEach((project: Project) => {
        const div = document.createElement('div');
        const projectCategoryClass = project.category.toLowerCase().replace(/ /g, '-');
        div.className = `square project-square ${projectCategoryClass}`;
        div.id = `${project.projectNumber}`;
        const yearCode = project.year.toString().substring(2, 4); // Adjusted for TypeScript
        div.innerHTML = `0${yearCode}<br>${project.projectNumber < 100 ? `0${project.projectNumber}` : project.projectNumber}`;
        div.setAttribute('data-info', JSON.stringify(project));
        container.appendChild(div);

        // Add event listener for project squares
        div.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'project',
                x: event.x,
                y: event.y,
                projectNumber: project.projectNumber,
                title: project.title,
                category: project.category,
                year: project.year,
            });
        });
    });
}

function insertSocialSquares(container: HTMLDivElement, numberOfProjects: number): void {
    // Define social media icons
    const socialIcons: PageInformation[] = [
        { name: "Facebook", iconFileName: "facebook-icon.webp", link: "https://www.facebook.com/marcello.nasso" },
        { name: "Instagram", iconFileName: "instagram-icon.webp", link: "https://www.instagram.com/marcello.nasso/" },
        { name: "YouTube", iconFileName: "youtube-icon.webp", link: "https://www.youtube.com/channel/UCtx0smQTZry7_R40w26-r7A?view_as=subscriber" },
        { name: "LinkedIn", iconFileName: "linkedin-icon.webp", link: "https://www.linkedin.com/company/marcello-nasso-architect/about/" },
        { name: "Spazio", iconFileName: "spazio-icon.webp", link: "https://www.spaziodiffuso.com" },
    ];

    // Calculate the current number ofsquares
    const currentSquareCount = container.querySelectorAll('.square').length;

    insertRandomElements(container, (index) => {
        const socialIcon = socialIcons[index];
        const socialDiv = document.createElement('div');
        socialDiv.className = 'square social-square';
        socialDiv.innerHTML = `<a href="${socialIcon.link}" target="_blank">
                                   <img src="../assets/img/icons/${socialIcon.iconFileName}" alt="${socialIcon.name}" width="40">
                               </a>`;
        return socialDiv;
    }, socialIcons.length, currentSquareCount / 2, currentSquareCount - 1);
}

function insertControlSquares(container: HTMLDivElement): void {

    const numberOfControlSquares = 5; // Menu + Legend + Blog + Sorting + Language

    const pages: PageInformation[] = [
        { name: "Contact", link: "contact.html" },
        { name: "Biography", link: "biography.html" },
        { name: "Imprint", link: "imprint.html" },
    ];
    const legend: LegendEntry[] = [
        { title: "urban planning", color: "#a9d252" },
        { title: "single building", color: "#93dbe0" },
        { title: "transformation", color: "#ffadc3" },
        { title: "interior work", color: "#ffa937" },
        { title: "installation", color: "#ffce36" },
    ];
    const blogPage: PageInformation = { name: "Blog", link: "blog.html" };
    const languages: Languages[] = [Languages.EN, Languages.DE, Languages.IT];
    const sortingOption: SortingOptions[] = [SortingOptions.NUMBER, SortingOptions.COLOUR, SortingOptions.PROGRAM, SortingOptions.PHASE];

    const currentSquareCount = container.querySelectorAll('.square').length;

    // Randomly select positions for control squares from 0 to currentSquareCount/2
    const randomPositions = getRandomPositions(0, currentSquareCount / 2, numberOfControlSquares);

    // Insert square for navigation menu
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="../assets/img/icons/menu-white.webp" alt="Menu" width="40">`;
        // Add event listener for menu squares
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'menu',
                x: event.x,
                y: event.y,
                pages: pages,
            });
        });
        return controlDiv;
    }, randomPositions[0], 0);

    // Insert square for legend
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="../assets/img/icons/mna-logo-white.webp" alt="Legend" width="40">`;
        // Add event listener for legend squares
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'legend',
                x: event.x,
                y: event.y,
                entries: legend,
            });
        });

        return controlDiv;
    }, randomPositions[1], 1);

    // Insert square for blog
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="../assets/img/icons/blog-white.webp" alt="Blog" width="40">`;
        // Add event listener for blog squares
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            //Navigate to blog page
            window.location.href = blogPage.link;
        });
        return controlDiv;
    }, randomPositions[2], 2);

    // Insert square for sorting options
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="../assets/img/icons/sorting-white.webp" alt="Sorting" width="40">`;
        // Add event listener for sorting squares
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'sorting',
                x: event.x,
                y: event.y,
                options: sortingOption,
            });
        });
        return controlDiv;
    }, randomPositions[3], 3);

    // Insert square for language options
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="../assets/img/icons/world-white.webp" alt="Language" width="40">`;
        // Add event listener for language squares
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'languages',
                x: event.x,
                y: event.y,
                languages: languages,
            });
        });
        return controlDiv;
    }, randomPositions[4], 4);
}

function insertPlaceholderSquares(container: HTMLDivElement): void {
    // Clear previous placeholders before adding new ones
    container.querySelectorAll('.square.placeholder').forEach(placeholder => {
        container.removeChild(placeholder);
    });

    const containerStyle = window.getComputedStyle(container);
    const squareStyle = window.getComputedStyle(document.querySelector('.square') as Element);

    const squareWidth = parseFloat(squareStyle.width) + parseFloat(squareStyle.marginLeft) + parseFloat(squareStyle.marginRight);
    const containerWidth = container.clientWidth; // Use clientWidth to exclude padding
    const gapWidth = parseFloat(containerStyle.gap);

    // Calculate how many squares fit per row, considering the gap
    const squaresPerRow = Math.floor((containerWidth + gapWidth) / (squareWidth + gapWidth));

    // Calculate the current number of non-placeholder squares
    const currentSquareCount = container.querySelectorAll('.square:not(.placeholder)').length;

    // Determine how many squares are in the last row
    const squaresInLastRow = currentSquareCount % squaresPerRow;

    // Calculate how many placeholders are needed
    const placeholdersNeeded = squaresInLastRow > 0 ? squaresPerRow - squaresInLastRow : 0;

    insertRandomElements(container, () => {
        const placeholderDiv = document.createElement('div');
        placeholderDiv.className = 'square placeholder';
        return placeholderDiv;
    }, placeholdersNeeded, 0, currentSquareCount + placeholdersNeeded);
}

function debounce(callback: (...args: any[]) => void, wait: number): () => void {
    let timeoutId: number | undefined;

    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

function redirectToProjectPage(projectNumber: number): void {
    // Redirect to a details page with projectNumber as a URL parameter
    window.location.href = `project-details.html?projectNumber=${projectNumber}`;
}

function showPopup(data: ProjectData | NavigationData | LegendData | LanguageData | SortingData): void {
    const popup = document.getElementById('generic-popup') as HTMLDivElement;
    const popupContent = document.getElementById('popup-content') as HTMLDivElement;
    const popupCloseButton = document.getElementById('popup-close') as HTMLButtonElement;
    popup.classList.remove('popup-hidden');

    if (!popup || !popupContent || !popupCloseButton) {
        console.error('Popup elements are missing.');
        return;
    }

    popupContent.innerHTML = '';

    switch (data.type) {
        case 'project':
            data = data as ProjectData;
            updateProjectImage(data as ProjectData);
            generateProjectContent(data as ProjectData, popupContent);
            popup.classList.add('popup-project');
            break;
        case 'legend':
            data = data as LegendData;
            popupContent.innerHTML = generateLegendContent(data.entries);
            popup.classList.add('popup-legend');
            break;
        case 'menu':
            data = data as NavigationData;
            popupContent.innerHTML = `<ul class="menu-list">${generateMenuContent(data.pages)}</ul>`;
            popup.classList.add('popup-menu');
            break;
        case 'languages':
            data = data as LanguageData;
            popupContent.innerHTML = generateLanguageOptions();
            popup.classList.add('popup-language');
            setupLanguageOptions();
            break;
        case 'blog':
            // Redirect to blog page with the click event
            break;
        case 'sorting':
            data = data as SortingData;
            popupContent.innerHTML = generateSortingOptions(data.options);
            setupSortingOptions();
            popup.classList.add('popup-sorting');
            break;
    }

    // Calculate popup position to avoid overflow
    const x = Math.min(data.x, window.innerWidth - 300); // 300px is the popup width
    const y = Math.min(data.y, window.innerHeight - 300); // 300px is the popup height

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    addClosePopupEvent(popup, popupCloseButton);
}

function addClosePopupEvent(popup: HTMLDivElement, popupCloseButton: HTMLButtonElement): void {
    popupCloseButton.addEventListener('click', () => {
        //Remove classes that are specific to the popup type
        popup.classList.forEach(className => {
            if (className !== 'generic-popup') {
                popup.classList.remove(className);
            }
        });
        // Remove the project image
        removeProjectImage(); // Remove old project image if present

        // Hide the popup
        popup.classList.add('popup-hidden');
    });
}

function generateProjectContent(project: ProjectData, container: HTMLElement): void {
    container.innerHTML = `
        <h2>${project.title}</h2>
        <p>Project Number: ${project.projectNumber}</p>
        <p>Category: ${project.category}</p>
        <p>Year: ${project.year}</p>
    `;

    // Create a button for redirection
    const button = document.createElement('button');
    button.className = 'project-button';
    button.textContent = '+';
    button.style.fontSize = '2rem';
    button.addEventListener('click', () => redirectToProjectPage(project.projectNumber));

    // Append button to the after the project content
    container.appendChild(button);
}

function updateProjectImage(project: ProjectData) {
    const popupImage = document.getElementById('popup-image') as HTMLDivElement;
    if (popupImage) {
        popupImage.style.background = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3)), url('../assets/projects/${project.projectNumber}/img/thumbnail.jpg')`;
        popupImage.style.backgroundSize = 'cover';
        popupImage.style.backgroundPosition = 'center';
    }
}

function removeProjectImage() {
    const popupImage = document.getElementById('popup-image') as HTMLDivElement;
    if (popupImage) {
        popupImage.style.background = '';
    }
}

function generateLegendContent(legends: LegendEntry[]): string {
    return legends.map(legend => `
        <div class="legend-entry">
            <span class="legend-color" style="background-color: ${legend.color};"></span>
            <span class="legend-text">${legend.title}</span>
        </div>
    `).join('');
}

function generateMenuContent(pages: PageInformation[]): string {
    return pages.map(page => `
      <li class="menu-item">
          <a href="${page.link}">${page.name}</a>
      </li>
    `).join('');
}

function generateSortingOptions(options: SortingOptions[]): string {
    return options.map(option => `
      <div class="sorting-option" data-sort="${option}">
        ${option}
      </div>
    `).join('');
}

function setupSortingOptions(): void {
    document.querySelectorAll(".sorting-option").forEach(option => {
        option.addEventListener('click', () => {
            const sortOrder = (option as HTMLElement).dataset.sort as SortingOptions;
            const projectsData = JSON.parse(localStorage.getItem('projectsData') || '{}');
            createSquares(projectsData, sortOrder);
        });
    });
}

//#region Language selection

function generateLanguageOptions(): string {
    const languages: Languages[] = [Languages.EN, Languages.DE, Languages.IT]; // Available languages
    return languages.map(lang => `
        <div class="language-option" data-lang="${lang}">
            ${lang}
        </div>
    `).join('');
}

function applyLanguage(language: string): void {
    // Save the selected language in local storage
    localStorage.setItem('selectedLanguage', language);

    // Apply the language selection to the page (e.g., update text content)
    // This is where you might update the page content based on the selected language
}

function updatePageContent() {
    // Simply reload the page to reflect the new language selection
    window.location.reload();
}

function setupLanguageOptions(): void {
    document.querySelectorAll(".language-option").forEach(langOption => {
        langOption.addEventListener('click', () => {
            const selectedLang = (langOption as HTMLElement).dataset.lang;
            if (selectedLang) {
                applyLanguage(selectedLang);
                // Reload or update the page content as necessary
                updatePageContent();
            }
        });
    });
}

//#endregion

document.addEventListener('ProjectsDataLoaded', () => {
    const projectsData = localStorage.getItem('projectsData') || '{}';
    createSquares(JSON.parse(projectsData));
});

// Additionally, check if data is already available on page load and immediately display squares if so
if (localStorage.getItem('projectsData')) {
    createSquares(JSON.parse(localStorage.getItem('projectsData') || '{}'));
}

document.addEventListener('DOMContentLoaded', () => {
    const selectedLang = localStorage.getItem('selectedLanguage') || Languages.EN; // Default to English
    applyLanguage(selectedLang);
});
