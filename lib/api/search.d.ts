export interface shindenSearchResult {
    title: string;
    link: string;
    image_url: string;
    tags: string[];
    type: string;
    episodes: string;
    grade: number;
}
export declare function scrapeSearchShinden(url: string): Promise<shindenSearchResult[]>;
