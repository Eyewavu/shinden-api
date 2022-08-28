import { load } from "cheerio";
import { fetchRawHtml } from "../utils/fetch";

export interface shindenEpisodeListItem {
  link: string,
  name: string,
  date: string,
  id: number,
  lang: string[],
  avaiable: boolean,
}
export async function scrapeAllEpisodesShinden(link:string):Promise<shindenEpisodeListItem[]> {
  const html =await fetchRawHtml(`https://shinden.pl${link}/episodes`)
  const index1 =html.indexOf("table")
  const index2 =html.lastIndexOf("/table")

  const $ =load(html.substring(index1 -6, index2 +7))
  
  const list =[] as shindenEpisodeListItem[]
  $(".list-episode-checkboxes>tr").each(function() {
    const $item = $(this)
    
    list.push({
      link: $item.find("a").attr("href") || "",
      name: $item.find(".ep-title").text(),
      date: $item.find(".ep-date").text(),
      id: parseInt($item.find("td:nth-child(1)").text()),
      lang: $item.find(".flag-icon").parent().html()?.match(/(?<=title=").+(?=">)/g) || [],
      avaiable: !!$item.find("i").attr("class")?.includes("fa-check")
    })
  })

  list.sort((a,b) => a.id - b.id)
  return list
}