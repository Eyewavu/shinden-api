export interface shindenEpisodeListItem {
    link: string;
    name: string;
    date: string;
    id: number;
    lang: string[];
    avaiable: boolean;
}
export declare function scrapeAllEpisodesShinden(link: string): Promise<shindenEpisodeListItem[]>;
