class Slideshow {
    private currentIndex: number = 0; // Index of the next image to show
    private images: string[] = [];
    private intervalId: number | undefined;
    private activeImageIndex: number = 0; // Index to track which img element is active (0 or 1)

    constructor(private imgElements: NodeListOf<HTMLImageElement>, private duration: number = 3000) {
        this.images = [
            '../assets/landing-page/img1.webp',
            '../assets/landing-page/img2.webp',
            '../assets/landing-page/img3.webp',
            '../assets/landing-page/img4.webp',
            '../assets/landing-page/img5.webp'
        ];

        // Initialize first two images
        this.imgElements[0].src = this.images[0];
        this.imgElements[0].style.opacity = '1';
        this.imgElements[1].src = this.images[1]; // Preload the second image
        this.imgElements[1].style.opacity = '0';

        this.start();
    }

    private start(): void {
        this.intervalId = window.setInterval(() => {
            this.nextImage();
        }, this.duration);
    }

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

document.addEventListener('DOMContentLoaded', () => {
    const imgElements = document.querySelectorAll('.image-wrapper .slide') as NodeListOf<HTMLImageElement>;
    if (imgElements.length === 2) {
        new Slideshow(imgElements);
    } else {
        console.error('Slideshow requires exactly 2 image elements.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const logoWrapper = document.querySelector('.logo-wrapper'); // Select the logo image
    if (logoWrapper) {
        logoWrapper.addEventListener('click', () => {
            window.location.href = 'home.html'; // Change the current page to 'home.html'
        });
    }
});
