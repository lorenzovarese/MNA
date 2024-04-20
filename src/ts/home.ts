
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

interface NavigationSquare {
    name: string;
    icon: string;
    link: string;
}

/**
 * Creates squares for each project in the provided data object and appends them to the squares container.
 * 
 * @param data - The data object containing project information.
 */
function createSquares(data: Record<string, Project>): void {
    const container = document.querySelector('.squares-container') as HTMLDivElement;
    if (!container) return; // Guard to ensure container exists

    container.innerHTML = ''; // Clear existing squares before adding new ones

    // Convert object to array and sort it based on year
    const projectsArray: Project[] = Object.values(data).sort((a, b) => a.year - b.year);

    // Create squares for all projects
    projectsArray.forEach((project: Project) => {
        const div = document.createElement('div');
        const projectCategoryClass = project.category.toLowerCase().replace(/ /g, '-');
        div.className = `square ${projectCategoryClass}`;
        const yearCode = project.year.toString().substring(2, 4); // Adjusted for TypeScript
        div.innerHTML = `0${yearCode}<br>${project.projectNumber < 100 ? `0${project.projectNumber}` : project.projectNumber}`;
        div.setAttribute('data-info', JSON.stringify(project));
        container.appendChild(div);

        div.addEventListener('click', (event) => {
            // Define the event for passing the coordinates of the click
            if (window.innerWidth > 415) {
                showPopup(event, project);
            } else {
                redirectToProjectPage(project.projectNumber);
            }
        });
    });

    insertSocialSquares(container, projectsArray.length);
    addPlaceholderSquares(document.querySelector('.squares-container') as HTMLDivElement);

    let lastWindowWidth = window.innerWidth;

    window.addEventListener('resize', debounce(() => {
        const currentWindowWidth = window.innerWidth;
      
        // Check if the width has changed
        if (currentWindowWidth !== lastWindowWidth) {
          const container = document.querySelector('.squares-container') as HTMLDivElement;
          addPlaceholderSquares(container);
          lastWindowWidth = currentWindowWidth; // Update the last known width
        }
      }, 100));
}

function getRandomPositions(startIndex: number, endIndex: number, count: number): number[] {
    const positions = new Set<number>();
    while (positions.size < count) {
        const randomPosition = Math.floor(Math.random() * (endIndex - startIndex + 1)) + startIndex;
        positions.add(randomPosition);
    }
    return Array.from(positions);
}

function insertRandomElements(container: HTMLDivElement, createDiv: (index: number) => HTMLDivElement, insertCount: number, startIndex: number, endIndex: number): void {
    const randomPositions = getRandomPositions(startIndex, endIndex, insertCount);

    randomPositions.forEach((position, index) => {
        const newDiv = createDiv(index);
        const insertBeforeNode = container.children[position] || null;
        container.insertBefore(newDiv, insertBeforeNode);
    });
}

function insertSocialSquares(container: HTMLDivElement, numberOfProjects: number): void {
    // Define social media icons
    const socialIcons: NavigationSquare[] = [
        { name: "Facebook", icon: "facebook-icon.webp", link: "https://www.facebook.com/marcello.nasso" },
        { name: "Instagram", icon: "instagram-icon.webp", link: "https://www.instagram.com/marcello.nasso/" },
        { name: "YouTube", icon: "youtube-icon.webp", link: "https://www.youtube.com/channel/UCtx0smQTZry7_R40w26-r7A?view_as=subscriber" },
        { name: "LinkedIn", icon: "linkedin-icon.webp", link: "https://www.linkedin.com/company/marcello-nasso-architect/about/" },
        { name: "Spazio", icon: "spazio-icon.webp", link: "https://www.spaziodiffuso.com" },
    ];

    // Calculate the current number ofsquares
    const currentSquareCount = container.querySelectorAll('.square').length;

    insertRandomElements(container, (index) => {
        const socialIcon = socialIcons[index];
        const socialDiv = document.createElement('div');
        socialDiv.className = 'square social-square';
        socialDiv.innerHTML = `<a href="${socialIcon.link}" target="_blank">
                                   <img src="../assets/img/icons/${socialIcon.icon}" alt="${socialIcon.name}" width="40">
                               </a>`;
        return socialDiv;
    }, socialIcons.length, currentSquareCount/2, currentSquareCount - 1);
}

function addPlaceholderSquares(container: HTMLDivElement): void {
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
    }, placeholdersNeeded, 0, currentSquareCount + placeholdersNeeded );
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

function showPopup(event: MouseEvent, project: Project) {
    const popup = document.getElementById('popup') as HTMLDivElement;
    const popupImage = document.getElementById('popup-image') as HTMLDivElement;
    const popupProjectNumber = document.getElementById('popup-project-number') as HTMLTableCellElement; // Change to HTMLTableCellElement
    const popupTitle = document.getElementById('popup-title') as HTMLTableCellElement; // Change to HTMLTableCellElement
    const popupCategory = document.getElementById('popup-category') as HTMLTableCellElement; // Change to HTMLTableCellElement
    const popupYear = document.getElementById('popup-year') as HTMLTableCellElement; // Change to HTMLTableCellElement
    const popupClose = document.getElementById('popup-close') as HTMLButtonElement;
    const popupRedirect = document.getElementById('popup-redirect') as HTMLButtonElement;

    if (!popup || !popupImage || !popupProjectNumber || !popupTitle || !popupCategory || !popupYear || !popupClose || !popupRedirect) {
        console.error('One or more popup elements are missing.');
        return;
    }

    // Retrieve the project data from localStorage
    const projectData: Project | undefined = JSON.parse(localStorage.getItem('projectsData') || '{}')[project.projectNumber.toString()];

    // Populate the popup with project data
    if (projectData) {
        popupProjectNumber.textContent = projectData.projectNumber.toString();
        popupTitle.textContent = projectData.title;
        popupCategory.textContent = projectData.category;
        popupYear.textContent = projectData.year.toString();
    }

    // Associate the popup image with the project thumbnail
    popupImage.style.backgroundImage = `url(../assets/projects/${project.projectNumber}/img/thumbnail.jpg)`;

    // Calculate popup position to avoid overflow
    const x = Math.min(event.clientX, window.innerWidth - 300); // 300px is the popup width
    const y = Math.min(event.clientY, window.innerHeight - 300); // 300px is the popup height

    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;

    (popup as HTMLDivElement).classList.remove('popup-hidden');

    popupClose.addEventListener('click', () => {
        (popup as HTMLDivElement).classList.add('popup-hidden');
    });

    popupRedirect.addEventListener('click', () => {
        redirectToProjectPage(project.projectNumber);
    });
}



document.addEventListener('ProjectsDataLoaded', () => {
    const projectsData = localStorage.getItem('projectsData') || '{}';
    createSquares(JSON.parse(projectsData));
});

// Additionally, check if data is already available on page load and immediately display squares if so
if (localStorage.getItem('projectsData')) {
    createSquares(JSON.parse(localStorage.getItem('projectsData') || '{}'));
}