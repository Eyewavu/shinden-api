export default function noImageDetector(url: string): string;
export declare const areTagsNsfw: (tags: string[]) => boolean;
export declare function fixImageUrl(image_url: string, title: string, nsfw: boolean): Promise<string>;
