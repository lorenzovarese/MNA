import { Languages, SortingOptions } from './../home';

export interface PageInformation {
    name: string;
    iconFileName?: string;
    link: string;
}

export interface PopupData {
    type: 'project' | 'legend' | 'menu' | 'languages' | 'blog' | 'sorting';
    x: number;
    y: number;
}

export interface ProjectData extends PopupData {
    projectNumber: number;
    projectName: string;
    lastProjectPhase: number
    title: string;
    category: string;
    year: number;
}

export interface NavigationData extends PopupData {
    pages: PageInformation[];
}

export interface LegendData extends PopupData {
    entries: Record<string, string>; // <categoy name, color in html code>
}

export interface LanguageData extends PopupData {
    languages: Languages[];
}

export interface SortingData extends PopupData {
    options: SortingOptions[];
}
