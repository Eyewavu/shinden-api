export interface shindenPlayer {
    source: string;
    quality: string;
    dub_lang: string;
    sub_lang: string;
    id: string;
}
export declare function scrapeVideoPlayerIdsShinden(link: string): Promise<shindenPlayer[]>;
