export interface shindenAnimeDetails {
    title: string;
    full_title: string;
    image_url: string;
    description: string;
    tags: shindenTags;
    rating: {
        overall: number;
        plot: number;
        art: number;
        music: number;
        characters: number;
    };
    related: shindenRelatedShow[];
    characters: shindenCharacter[];
    cast: shindenCast[];
    info: shindenAnimeInfo;
}
export interface shindenRelatedShow {
    title: string;
    image_url: string;
    link: string;
    media: string;
    type: string;
}
export interface shindenTags {
    genres: string[];
    target: string[];
    characters: string[];
    time_place: string[];
    origin: string[];
    other: string[];
}
export interface shindenStudio {
    name: string;
    link: string;
}
export interface shindenAnimeInfo {
    type: string;
    status: string;
    air_date: string;
    full_date: string;
    episodes: number;
    studios: shindenStudio[];
    episde_length: string;
    mpaa: string;
}
export interface shindenCast {
    image_url: string;
    name: string;
    description: string;
}
export interface shindenCharacter {
    link: string;
    name: string;
    image_url: string;
    type: string;
    vc: {
        name: string;
        country: string;
        link: string;
        image_url: string;
    };
}
export declare function scrapeAnimeInfoShinden(url: string): Promise<shindenAnimeDetails>;
