# MNA ✏️📐

Marcello Nasso Architect Website

This README outlines the structure and naming conventions adopted for the development of a multipage website utilizing HTML, CSS, and TypeScript. The structure is designed to maintain clarity, promote scalability, and ensure ease of maintenance throughout the project lifecycle.

## Directory Structure

Below is the recommended directory structure for this project:

```
/project-root
    /src
        /html
            - index.html
            - about.html
            - contact.html
        /css
            - style.css
            - header.css
            - footer.css
        /ts
            - app.ts
            - contact-form.ts
        /assets
            /images
            /fonts
    /dist
        /css
        /js
        /assets
```

### Source Directory (`/src`)

- **`/html`**: Contains all HTML files for the website. Each file is named according to its specific purpose or content.
- **`/css`**: Stores all CSS stylesheets. `style.css` serves as the main stylesheet, with additional files (e.g., `header.css`, `footer.css`) for styling specific components.
- **`/ts`**: Contains TypeScript files. The main file is `app.ts`, with other files such as `contact-form.ts` handling specific functionalities.
- **`/assets`**: Used for static resources like images and fonts, organized into subdirectories (`/images`, `/fonts`).

### Distribution Directory (`/dist`)

This directory hosts the compiled or processed files ready for deployment. It mirrors the structure of `/src` but contains the output from the build process, including compiled CSS and JavaScript files.

## Naming Conventions

- **Files**: Use lowercase and separate words with hyphens (e.g., `contact-form.ts`). This approach is both readable and prevents case sensitivity issues.
- **Global Styles/Scripts**: Prefix filenames of styles and scripts with `global-` to denote their application across multiple pages (e.g., `global-styles.css`, `global-utils.ts`).
