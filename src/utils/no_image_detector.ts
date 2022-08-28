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
  else image_url ="https://st2.depositphotos.com/1865899/10467/v/450/depositphotos_104676254-stock-illustration-under-eighteen-round-sign-adults.jpg"
  return image_url
}