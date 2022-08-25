import { shindenTagCharacters, shindenTagGenre, shindenTagOther, shindenTagTarget, shindenTagtimePlace } from "./tags";
declare type optionTags<Tag> = {
    include: Tag[];
    exclude: Tag[];
};
declare type seriesType = "TV" | "ONA" | "Movie" | "Special" | "Music";
declare type seriesStatus = "Proposal" | "Not yet aired" | "Currently Airing" | "Finished Airing";
export interface shindenAdvancedSearchOptions {
    tags?: {
        genres?: optionTags<shindenTagGenre>;
        target?: optionTags<shindenTagTarget>;
        characters?: optionTags<shindenTagCharacters>;
        time_place?: optionTags<shindenTagtimePlace>;
        other?: optionTags<shindenTagOther>;
        origin?: optionTags<shindenTagOther>;
    };
    date: {
        /*** format yyyy-mm-dd*/
        from?: string;
        /*** format yyyy-mm-dd*/
        to?: string;
        /**
         * * precision 3 - year,month,day
         * *  precision 2 - year,month
         * *  precision 1 - year
         *
         */
        precision?: 3 | 2 | 1;
    };
    type?: seriesType[];
    status?: seriesStatus[];
    /*** episode length in minutes*/
    episodeLength?: {
        /*** episode length in minutes*/
        min: number;
        /*** episode length in minutes*/
        max: number;
    };
    numberOfEpisodes?: {
        min: number;
        max: number;
    };
    letter: "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "1";
    title: "contains" | "equals";
    sort: {
        by: "type" | "episodes" | "status" | "rating";
        order?: "Descending" | "Ascending";
    };
    page?: number;
}
export declare function advancedSearchShinden(options?: shindenAdvancedSearchOptions, query?: string): Promise<import("./search").shindenSearchResult[]>;
export {};
