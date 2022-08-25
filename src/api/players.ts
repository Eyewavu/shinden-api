import { load } from "cheerio";
import { fetchFromShinden } from "../utils/fetch";

export interface shindenPlayer {
  source: string,
  quality: string,
  dub_lang: string,
  sub_lang: string,
  id: string,
}
export async function scrapeVideoPlayerIdsShinden(link:string):Promise<shindenPlayer[]> {
  const html =await fetchFromShinden(`https://shinden.pl${link}`)
  const index1 =html.indexOf("episode-player-list")
  const index2 =html.lastIndexOf("player-navigator-section box")

  const $ =load(html.substring(index1 -20, index2 -17))
  const list =[] as shindenPlayer[]
  $("tbody >tr").each(function(){
    const $item = $(this)

    list.push({
      source: $item.find(".ep-pl-name").text(),
      quality: $item.find(".ep-pl-res").text(),
      dub_lang: $item.find(".ep-pl-alang").text().replace(/\s/g,""),
      sub_lang: $item.find(".ep-pl-slang").text().replace(/\s/g,""),
      id: $item.find(".ep-buttons a").attr("id")?.replace(/player_data_/,"") || ""
    })
  })

  return list
}