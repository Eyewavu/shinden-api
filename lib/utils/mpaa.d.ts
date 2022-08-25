export declare type mpaaRating = "G" | "PG" | "PG-13" | "R" | "RY";
export declare type ageRating = "All" | "7+" | "13+" | "16+" | "18+";
export declare function mpaaToAgeGroup(input: string | mpaaRating): ageRating | undefined;
