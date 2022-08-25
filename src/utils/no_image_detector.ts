import { searchImageMal } from "./mal_images"

export default function noImageDetector(url:string) {
  if ( url.includes("/res/other") ) return ""
  if ( url.includes("javascript:") ) return ""
  return url
}

export const areTagsNsfw =(tags:string[]) => tags.map(t => t.toUpperCase())
.some(t => 
  t === "HENTAI" ||
  t === "YAOI" ||
  t === "YURI"
)

export async function fixImageUrl(image_url:string,title:string,nsfw:boolean) {
  if ( !nsfw ) {
    if ( !image_url ) {
      image_url =await searchImageMal(title)
    }
    else {
      image_url ="https://shinden.pl" +image_url
    }
  }
  else image_url ="https://i.ebayimg.com/images/i/252339513231-0-1/s-l1000.jpg"
  return image_url
}