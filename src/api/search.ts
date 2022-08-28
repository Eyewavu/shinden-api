import { load } from "cheerio";
import { fetchRawHtml } from "../utils/fetch";
import noImageDetector, { areTagsNsfw, fixImageUrl } from "../utils/no_image_detector";
import parseNumber from "../utils/parse_number";

export interface shindenSearchResult {
  title: string,
  link: string,
  image_url: string,
  tags: string[],
  type: string,
  episodes: string,
  grade: number,
}
export async function scrapeSearchShinden(url:string):Promise<shindenSearchResult[]> {
  const html =await fetchRawHtml(url)
  
  const index =html.indexOf("<article>")
  const index2 =html.lastIndexOf("</article>")
  const $ =load(html.substring(index +9,index2))

  const promiseArray:Promise<shindenSearchResult>[] =[]
  $(".div-row").each(function() {
    const $item =$(this)
    
    promiseArray.push(new Promise(async resolve => {
      const title =$item.find("h3>a").text()
      const tags =$item.find(".tags").text().split("\n").filter(i => i)

      let image_url =noImageDetector($item.find(".cover-col>a").attr("href") || "")
      const nsfw =areTagsNsfw(tags)
      image_url =await fixImageUrl(image_url,title,nsfw)
      
      resolve({
        title,
        link:$item.find("h3>a").attr('href') || "",
        image_url,
        tags,
        type: $item.find(".title-kind-col").text(),
        episodes: $item.find(".episodes-col").attr("title") || "",
        grade: parseNumber($item.find(".rate-top").text() || "0"),
      })
    }))
  })
  
  const list =await Promise.all(promiseArray)

  return list
}