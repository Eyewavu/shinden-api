export interface shindenVoiceActor {
    name: string;
    link: string;
    image_url: string;
    lang: string;
}
export interface shindenHistoryItem {
    image_url: string;
    title: string;
    type: string;
    date: string;
    role: string;
}
export declare function scrapeCharacterShinden(link: string): Promise<{
    name: string;
    image_url: string | undefined;
    info: [string, string][];
    voice_actors: shindenVoiceActor[];
    history: shindenHistoryItem[];
}>;
