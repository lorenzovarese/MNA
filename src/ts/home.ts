
import { Project, ProjectMetadata } from './interfaces/project-interfaces';
import { ProjectData, NavigationData, LegendData, LanguageData, SortingData, PageInformation } from './interfaces/home-interfaces';

export enum Languages {
    EN = 'EN',
    DE = 'DE',
    IT = 'IT',
}

export enum SortingOptions {
    NUMBER = 'number',
    COLOUR = 'colour',
    PROGRAM = 'program',
    PHASE = 'phase',
}

export const categoryColors: Record<string, string> = {
    "activity": "#ffffff",
    "urban planning": "#a9d252",
    "single building": "#93dbe0",
    "transformation": "#ffadc3",
    "interior work": "#ffa937",
    "installation": "#ffce36",
    "default": "#f0f0f0"
};

const projectFolder : string = "../assets/projects";
const iconFolder : string = "../assets/img/icons";

//#region Squares Display Functions

/**
 * Creates visual representations of projects as squares within a specified container.
 * The squares can be sorted based on specified criteria, and will adjust layout on window resize.
 * 
 * @param {Record<string, Project>} data - Object containing project data keyed by unique identifiers.
 * @param {SortingOptions} sortOrder - The criteria by which projects are sorted (defaults to SortingOptions.NUMBER).
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

/**
 * Inserts project-specific squares into the provided container.
 * Each square represents a project and is clickable to show more details.
 * 
 * @param {HTMLDivElement} container - The container where project squares will be inserted.
 * @param {Project[]} projectsArray - Array of projects to display.
 */
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
                projectName: project.projectName,
                lastProjectPhase: project.phase || 2, // fallback to 2 as the most frequent
                title: project.title,
                category: project.category,
                year: project.year,
            });
        });
    });
}

/**
 * Inserts squares for social media links dynamically into the squares container.
 * The positions of these squares are calculated based on the current number of squares.
 * 
 * @param {HTMLDivElement} container - The container where social squares will be added.
 * @param {number} numberOfProjects - The number of projects currently displayed, used to determine insert positions.
 */
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
                                   <img src="${iconFolder}/${socialIcon.iconFileName}" alt="${socialIcon.name}" width="40">
                               </a>`;
        return socialDiv;
    }, socialIcons.length, currentSquareCount / 2, currentSquareCount - 1);
}

/**
 * Inserts category control squares such as Profile, Context, Contents, and Outlook into the container.
 * Each category control square will display a menu with the respective pages when clicked.
 *
 * @param {HTMLDivElement} container - The container where the category control squares will be inserted.
 */
function insertCategoryControlSquares(container: HTMLDivElement): void {
    const categories: { name: string, pages: PageInformation[], icon: string }[] = [
        {
            name: 'Profile',
            pages: [
                { name: "Contact", link: "profile/contact.html" },
                { name: "Experiences", link: "profile/experiences.html" },
                { name: "Services", link: "profile/services.html" },
            ],
            icon: 'profile-icon.webp'
        },
        {
            name: 'Context',
            pages: [
                { name: "Introduction", link: "context/introduction.html" },
                { name: "Biography", link: "context/bio.html" },
                { name: "Thanks", link: "context/thanks.html" },
            ],
            icon: 'context-icon.webp'
        },
        {
            name: 'Contents',
            pages: [
                { name: "Systems", link: "contents/systems.html" },
                { name: "Process", link: "contents/process.html" },
                { name: "Models", link: "contents/models.html" },
                { name: "Research", link: "contents/research.html" },
                { name: "Categories", link: "contents/categories.html" },
            ],
            icon: 'contents-icon.webp'
        },
        {
            name: 'Outlook',
            pages: [
                { name: "Excursion", link: "outlook/excursion.html" },
                { name: "Conversation", link: "outlook/conversation.html" },
            ],
            icon: 'outlook-icon.webp'
        }
    ];

    const currentSquareCount = container.querySelectorAll('.square').length;
    const randomPositions = getRandomPositions(0, currentSquareCount / 2, categories.length);

    categories.forEach((category, index) => {
        insertRandomElement(container, () => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'square control-square';
            controlDiv.innerHTML = `<img src="${iconFolder}/${category.icon}" alt="${category.name}" width="40">`;
            controlDiv.addEventListener('click', (event: MouseEvent) => {
                showPopup({
                    type: 'menu',
                    x: event.x,
                    y: event.y,
                    pages: category.pages,
                });
            });
            return controlDiv;
        }, randomPositions[index], index);
    });
}

/**
 * Inserts legend and other control squares such as Blog, Sorting, and Language options into the container.
 *
 * @param {HTMLDivElement} container - The container where the legend and other control squares will be inserted.
 */
function insertLegendAndOtherControlSquares(container: HTMLDivElement): void {
    const blogPage: PageInformation = { name: "Blog", link: "blog.html" };
    const languages: Languages[] = [Languages.EN, Languages.DE, Languages.IT];
    const sortingOption: SortingOptions[] = [SortingOptions.NUMBER, SortingOptions.COLOUR, SortingOptions.PROGRAM, SortingOptions.PHASE];

    const currentSquareCount = container.querySelectorAll('.square').length;
    const randomPositions = getRandomPositions(0, currentSquareCount / 2, 4); // Adjust the number based on elements

    // Insert square for legend
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square logo-img';
        controlDiv.innerHTML = `<img src="${iconFolder}/mna-logo-white.webp" alt="Legend" width="40">`;
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'legend',
                x: event.x,
                y: event.y,
                entries: categoryColors,
            });
        });
        return controlDiv;
    }, randomPositions[0], 0);

    // Insert square for blog
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="${iconFolder}/blog-white.webp" alt="Blog" width="40">`;
        controlDiv.addEventListener('click', () => {
            window.location.href = blogPage.link;
        });
        return controlDiv;
    }, randomPositions[1], 1);

    // Insert square for sorting options
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="${iconFolder}/sorting-white.webp" alt="Sorting" width="40">`;
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'sorting',
                x: event.x,
                y: event.y,
                options: sortingOption,
            });
        });
        return controlDiv;
    }, randomPositions[2], 2);

    // Insert square for language options
    insertRandomElement(container, (index) => {
        const controlDiv = document.createElement('div');
        controlDiv.className = 'square control-square';
        controlDiv.innerHTML = `<img src="${iconFolder}/world-white.webp" alt="Language" width="40">`;
        controlDiv.addEventListener('click', (event: MouseEvent) => {
            showPopup({
                type: 'languages',
                x: event.x,
                y: event.y,
                languages: languages,
            });
        });
        return controlDiv;
    }, randomPositions[3], 3);
}

/**
 * Inserts all control squares, including category controls, legend, and other options, into the container.
 * This function combines the insertion of category control squares with the insertion of legend and other controls.
 *
 * @param {HTMLDivElement} container - The container where all control squares will be inserted.
 */
function insertControlSquares(container: HTMLDivElement): void {
    insertCategoryControlSquares(container);
    insertLegendAndOtherControlSquares(container);
}

/**
 * Inserts placeholder squares to maintain grid layout integrity during window resizing.
 * 
 * @param {HTMLDivElement} container - The container where placeholder squares will be added.
 */
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

//#endregion

//#region Popup Display and Interaction Functions

/**
 * Displays a popup based on the provided data type. The function dynamically changes the content
 * and style of the popup depending on the type of information (project, legend, etc.) to be displayed.
 * It also sets the popup's position to ensure it does not overflow the window bounds.
 *
 * @param {ProjectData | NavigationData | LegendData | LanguageData | SortingData} data - The data to be displayed in the popup.
 */
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

/**
 * Generates HTML content for a project popup, including project details and a redirection button.
 *
 * @param {ProjectData} project - Data about the project to display.
 * @param {HTMLElement} container - The container where the project content will be rendered.
 */
function generateProjectContent(project: ProjectData, container: HTMLElement): void {
    let titleHtmlTag : string;
    if (project.title.length < 20){
        titleHtmlTag = "h2"
    }else if(project.title.length >= 20 && project.title.length <= 28){
        titleHtmlTag = "h3"
    }else{
        titleHtmlTag = "h5"
    }
    container.innerHTML = `
        <${titleHtmlTag}>${project.title}</${titleHtmlTag}>
        <p>Project Number: ${project.projectNumber}</p>
        <p>Category: ${project.category}</p>
        <p>Year: ${project.year}</p>
    `;

    // Create a button for redirection
    const button = document.createElement('button');
    button.className = 'project-button';
    button.textContent = '+';
    button.style.fontSize = '3rem';
    button.addEventListener('click', () => redirectToProjectPage(project.projectNumber, project.lastProjectPhase.toString()));

    // Append button to the after the project content
    container.appendChild(button);
}

/**
 * Updates the background image of the popup to show the project's image or fallback to a color based on category.
 *
 * @param {ProjectData} project - Data about the project to display its image.
 */
function updateProjectImage(project: ProjectData) {
    const popupImage = document.getElementById('popup-image') as HTMLDivElement;
    const projectNumberPadded = project.projectNumber.toString().padStart(3, '0');
    const projectMetadata = JSON.parse(localStorage.getItem('projectsMetadata') || '{}') as Record<string, ProjectMetadata>;
    const metadata = projectMetadata[project.projectNumber.toString()];

    // Check if covers exist in project metadata
    if (metadata?.common?.covers) {
        const coversFolder = `${projectFolder}/${project.projectName}/${projectNumberPadded}.00_common/${projectNumberPadded}.00.01_covers`;
        if (popupImage) {
            popupImage.style.background = `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.33)), url('${coversFolder}/${projectNumberPadded}.00.01_cover_square.webp')`;
            popupImage.style.backgroundSize = 'cover';
            popupImage.style.backgroundPosition = 'center';
        }
    } else {
        // If no cover exists, use the category's color from the legend
        const defaultColor = '#ffffff'; // Default to white if category is not found
        const legendColor = categoryColors[project.category] || defaultColor;
        if (popupImage) {
            const intensityTop : number = (legendColor === defaultColor) ? 0.7 : 0.33; // If white, increase intensity of the black shadow for higher contrast in the background
            const intensityBottom : number = (legendColor === defaultColor) ? 0.2 : 0;
            popupImage.style.background = `linear-gradient(rgba(0, 0, 0, ${intensityTop}), rgba(0, 0, 0, ${intensityBottom})), ${legendColor}`;
            popupImage.style.backgroundSize = 'cover';
            popupImage.style.backgroundPosition = 'center';
        }
    }
}

/**
 * Clears the background image from the popup when it is closed or when the popup's content is changed.
 */
function removeProjectImage() {
    const popupImage = document.getElementById('popup-image') as HTMLDivElement;
    if (popupImage) {
        popupImage.style.background = '';
    }
}

/**
 * Redirects the user to a detailed page for a specific project with both project number and phase.
 *
 * @param {number} projectNumber - The project number to redirect to.
 * @param {string} phase - The project phase to include in the redirection.
 */
function redirectToProjectPage(projectNumber: number, phase: string): void {
    // Correct URL construction with multiple parameters
    window.location.href = `project-details.html?projectNumber=${projectNumber}&phase=${phase}`;
}

/**
 * Generates HTML content for displaying legend information in a popup.
 *
 * @param {Record<string, string>} legend - Dictionary of legend entries with categories as keys and colors as values.
 * @returns {string} HTML string representing the legend entries.
 */
function generateLegendContent(legend: Record<string, string>): string {
    return Object.entries(legend).map(([title, color]) => `
        <div class="legend-entry">
            <span class="legend-color" style="background-color: ${color};"></span>
            <span class="legend-text">${title}</span>
        </div>
    `).join('');
}

/**
 * Generates HTML content for the menu popup, listing navigation links.
 *
 * @param {PageInformation[]} pages - Array of page information objects for menu items.
 * @returns {string} HTML string representing the menu items.
 */
function generateMenuContent(pages: PageInformation[]): string {
    return pages.map(page => `
      <li class="menu-item">
          <a href="${page.link}">${page.name}</a>
      </li>
    `).join('');
}

/**
 * Generates HTML content for sorting options in a popup.
 *
 * @param {SortingOptions[]} options - Array of sorting options to display.
 * @returns {string} HTML string representing sorting options.
 */
function generateSortingOptions(options: SortingOptions[]): string {
    return options.map(option => `
      <div class="sorting-option" data-sort="${option}">
        ${option}
      </div>
    `).join('');
}

/**
 * Sets up event listeners for sorting options in the popup to allow dynamic sorting of project squares.
 */
function setupSortingOptions(): void {
    document.querySelectorAll(".sorting-option").forEach(option => {
        option.addEventListener('click', () => {
            const sortOrder = (option as HTMLElement).dataset.sort as SortingOptions;
            const projectsData = JSON.parse(localStorage.getItem('projectsData') || '{}');
            createSquares(projectsData, sortOrder);
        });
    });
}

//#endregion

//#region Sorting and Array Manipulation Functions

/**
 * Sorts an array of projects based on a specified criterion.
 * 
 * @param {Project[]} projectsArray - The array of projects to sort.
 * @param {SortingOptions} sortOrder - The criterion by which to sort the projects.
 * @returns {Project[]} The sorted array of projects.
 */
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
                if (!a.phase || !b.phase) {console.error('Cannot sort by phase when comparing these projects:', a.projectName, b.projectName); return 0;}
                return a.phase - b.phase;
            default:
                return 0;
        }
    });
}

/**
 * Generates a random position within a specified range.
 * 
 * @param {number} startIndex - The start index of the range.
 * @param {number} endIndex - The end index of the range.
 * @returns {number} A random index between the start and end indices.
 */
function getRandomPosition(startIndex: number, endIndex: number): number {
    return Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
}

/**
 * Generates multiple unique random positions within a specified range.
 * 
 * @param {number} startIndex - The start index of the range.
 * @param {number} endIndex - The end index of the range.
 * @param {number} count - The number of unique positions to generate.
 * @returns {number[]} An array of unique random positions.
 */
function getRandomPositions(startIndex: number, endIndex: number, count: number): number[] {
    const positions = new Set<number>();
    while (positions.size < count) {
        positions.add(getRandomPosition(startIndex, endIndex));
    }
    return Array.from(positions);
}

/**
 * Inserts a newly created element at a specified position within a container.
 * 
 * @param {HTMLDivElement} container - The container where the element will be inserted.
 * @param {(index: number) => HTMLDivElement} createDiv - A function that creates the new div element.
 * @param {number} randomPosition - The position in the container where the new element should be inserted.
 * @param {number} index - The index that may be used by the createDiv function to customize the element.
 */
function insertRandomElement(container: HTMLDivElement, createDiv: (index: number) => HTMLDivElement, randomPosition: number, index: number): void {
    const newDiv = createDiv(index);
    const insertBeforeNode = container.children[randomPosition] || null;
    container.insertBefore(newDiv, insertBeforeNode);
}

/**
 * Inserts multiple new elements at random positions within a specified range in a container.
 * 
 * @param {HTMLDivElement} container - The container where elements will be inserted.
 * @param {(index: number) => HTMLDivElement} createDiv - A function that creates new div elements.
 * @param {number} insertCount - The number of new elements to insert.
 * @param {number} startIndex - The start index of the range within the container.
 * @param {number} endIndex - The end index of the range within the container.
 */
function insertRandomElements(container: HTMLDivElement, createDiv: (index: number) => HTMLDivElement, insertCount: number, startIndex: number, endIndex: number): void {
    const randomPositions = getRandomPositions(startIndex, endIndex, insertCount);

    randomPositions.forEach((position, index) => {
        insertRandomElement(container, createDiv, position, index);
    });
}

//#endregion

//#region Language Handling Functions

/**
 * Generates HTML string for language selection options based on available languages.
 * This function creates div elements for each language that can be clicked to change the language setting.
 * 
 * @returns {string} HTML string containing div elements for each language option.
 */
function generateLanguageOptions(): string {
    const languages: Languages[] = [Languages.EN, Languages.DE, Languages.IT]; // Available languages
    return languages.map(lang => `
        <div class="language-option" data-lang="${lang}">
            ${lang}
        </div>
    `).join('');
}

/**
 * Saves the selected language in local storage and applies it to the page.
 * This typically triggers UI updates to reflect the new language.
 * 
 * @param {string} language - The language code to apply (e.g., 'EN', 'DE', 'IT').
 */
function applyLanguage(language: string): void {
    localStorage.setItem('selectedLanguage', language);
    // Additional UI update logic can be implemented here to change text content based on the selected language.
}

/**
 * Reloads the page to reflect the language change.
 * This function is called after a new language setting is applied to ensure the entire page reflects the selected language.
 */
function updatePageContent() {
    window.location.reload();
}

/**
 * Sets up event listeners for all language options on the page.
 * When a language option is clicked, the selected language is applied and the page content is updated accordingly.
 */
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

//#region Utility Functions

/**
 * Creates a debounced function that delays invoking the provided callback until after
 * a specified amount of milliseconds has elapsed since the last time it was invoked.
 * This is useful for performing actions such as resizing or scrolling, where you do not
 * want to handle every single event but rather after the events have stopped arriving.
 * 
 * @param {(...args: any[]) => void} callback - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay the function invocation.
 * @returns {() => void} A function that can be called in place of the original function.
 */
function debounce(callback: (...args: any[]) => void, wait: number): () => void {
    let timeoutId: number | undefined;

    return function (...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback.apply(null, args);
        }, wait);
    };
}

//#endregion

//#region Event Handling

/**
 * Adds an event listener to a popup close button to hide the popup and perform cleanup when clicked.
 * This function is responsible for removing the popup from view, clearing any specific popup-related
 * classes, and ensuring that any project images are removed to prevent outdated or incorrect data
 * from being displayed when the popup is reused.
 * 
 * @param {HTMLDivElement} popup - The popup element that contains the close button.
 * @param {HTMLButtonElement} popupCloseButton - The button element that closes the popup when clicked.
 */
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

//#endregion

/**
 * Initializes the display of project squares based on data available in local storage.
 * Ensures that the data is loaded and displayed only once, either upon direct check or when
 * a specific event indicates that project data has been loaded.
 */
function initializeProjectDisplay() {
    const projectsData = localStorage.getItem('projectsData') || '{}';
    createSquares(JSON.parse(projectsData));
}

async function main() {
    // Check if project data is already available in local storage to display it immediately on page load
    if (localStorage.getItem('projectsData')) {
        initializeProjectDisplay();
    } else {
        // Listen for the event that indicates data has just been loaded into local storage
        document.addEventListener('ProjectsDataLoaded', initializeProjectDisplay);
    }

    // Set up language settings based on stored preferences or default to English
    document.addEventListener('DOMContentLoaded', () => {
        const selectedLang = localStorage.getItem('selectedLanguage') || Languages.EN;
        applyLanguage(selectedLang);
    });
}

main();
