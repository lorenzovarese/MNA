
/**
 * Manages a simple slideshow functionality for cycling through a set of images automatically.
 * The slideshow supports fading transitions between images.
 */
class Slideshow {
    private currentIndex: number = 0; // Index of the next image to show
    private images: string[] = []; // Array of image URLs
    private intervalId: number | undefined; // Store interval ID for possible cleanup
    private activeImageIndex: number = 0; // Index to track which img element is active (0 or 1)

    /**
     * Initializes a new instance of the Slideshow class.
     * 
     * @param {NodeListOf<HTMLImageElement>} imgElements - The HTML image elements used for the slideshow.
     * @param {number} duration - Duration for each slide in milliseconds. Defaults to 3000 ms.
     */
    constructor(private imgElements: NodeListOf<HTMLImageElement>, private duration: number = 3000) {
        this.images = [
            '../assets/img/landing-page/img1.webp',
            '../assets/img/landing-page/img2.webp',
            '../assets/img/landing-page/img3.webp',
            '../assets/img/landing-page/img4.webp',
            '../assets/img/landing-page/img5.webp'
        ];

        // Initialize first two images
        this.imgElements[0].src = this.images[0];
        this.imgElements[0].style.opacity = '1';
        this.imgElements[1].src = this.images[1]; // Preload the second image
        this.imgElements[1].style.opacity = '0';

        this.start();
    }

    /**
     * Starts the automatic cycling of images at the set duration.
     */
    private start(): void {
        this.intervalId = window.setInterval(() => {
            this.nextImage();
        }, this.duration);
    }

    /**
     * Transitions to the next image in the slideshow, updating the active and inactive image elements.
     */
    private nextImage(): void {
        this.currentIndex = (this.currentIndex + 1) % this.images.length; // Calculate the next image index
        this.activeImageIndex = 1 - this.activeImageIndex; // Switch active image

        // Set the source for the new active image
        this.imgElements[this.activeImageIndex].src = this.images[this.currentIndex];

        // Fade in the new active image and fade out the other
        this.imgElements[this.activeImageIndex].style.opacity = '1';
        this.imgElements[1 - this.activeImageIndex].style.opacity = '0';
    }
}

/**
 * Main initialization function of the application. It sets up the necessary event listeners
 * for the DOMContentLoaded event to initialize the slideshow and set up interactive elements.
 * This function ensures that all components are ready and interactive once the document is fully loaded.
 */
function main() {
    // Event listener to initialize the slideshow when the document content is fully loaded.
    document.addEventListener('DOMContentLoaded', () => {
        const imgElements = document.querySelectorAll('.image-wrapper .slide') as NodeListOf<HTMLImageElement>;
        if (imgElements.length === 2) {
            new Slideshow(imgElements);
        } else {
            console.error('Slideshow requires exactly 2 image elements.');
        }
    });

    // Event listener to make the logo clickable and navigate to the home page when clicked.
    // document.addEventListener('DOMContentLoaded', () => {
    //     const logoWrapper = document.querySelector('.logo-wrapper'); // Select the logo image
    //     if (logoWrapper) {
    //         logoWrapper.addEventListener('click', () => {
    //             window.location.href = 'home.html'; // Change the current page to 'home.html'
    //         });
    //     }
    // });

    // Event listener to make the cross clickable and navigate to the home page when clicked.
    document.addEventListener('DOMContentLoaded', () => {
        const crossSymbol = document.querySelector('.cross-symbol'); // Select the cross image
        if (crossSymbol) {
            crossSymbol.addEventListener('click', () => {
                window.location.href = 'home.html'; // Change the current page to 'home.html'
            });
        }
    });
}

// Execute the main function to start the application.
main();
