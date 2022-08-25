import { load } from "cheerio";
import { getMonthNamePl } from "../utils/date";
import { fetchFromShinden } from "../utils/fetch";
import { mpaaToAgeGroup } from "../utils/mpaa";
import noImageDetector, { areTagsNsfw, fixImageUrl } from "../utils/no_image_detector";
import parseNumber from "../utils/parse_number";

export interface shindenAnimeDetails {
  title: string,
  full_title: string,
  image_url: string,
  description: string,
  tags: shindenTags,
  rating: {
    overall: number,
    plot: number,
    art: number,
    music: number,
    characters: number,
  },
  related: shindenRelatedShow[],
  characters: shindenCharacter[],
  cast: shindenCast[],
  info: shindenAnimeInfo
}
export interface shindenRelatedShow {
  title: string,
  image_url: string,
  link: string,
  media: string,
  type: string,
}
export interface shindenTags {
  genres: string[],
  target: string[],
  characters: string[],
  time_place: string[],
  origin: string[],
  other: string[],
}
export interface shindenStudio {
  name: string,
  link: string,
}
export interface shindenAnimeInfo {
  type: string,
  status: string,
  air_date: string,
  full_date: string,
  episodes: number,
  studios: shindenStudio[],
  episde_length: string,
  mpaa: string,
}
export interface shindenCast {
  image_url: string,
  name: string,
  description: string,
}
export interface shindenCharacter {
  link:string,
  name:string,
  image_url:string,
  type:string,
  vc: {
    name: string,
    country: string,
    link: string,
    image_url: string,
  }
}

export async function scrapeAnimeInfoShinden(url:string):Promise<shindenAnimeDetails> {
  const html =await fetchFromShinden(`https://shinden.pl${url}`)
  const $ =load(html)

  const tags ={
    genres:[],
    target:[],
    characters:[],
    time_place:[],
    origin:[],
    other:[]
  } as shindenTags
  $(".info-top-table-highlight").find(".tags").each(function() {
    const $item = $(this)
    const _tags =$item.parent().parent().before().text().trim().split(/\n+\s?/)
    const category =_tags.shift()

    switch (category) {
      case "Gatunki:":          tags.genres =[..._tags]; break
      case "Grupy docelowe:":   tags.target =[..._tags]; break
      case "Rodzaje postaci:":  tags.characters =[..._tags]; break
      case "Miejsce i czas:":   tags.time_place =[..._tags]; break
      case "Pierwowzór:":       tags.origin =[..._tags]; break
      case "Pozostałe tagi:":   tags.other =[..._tags]; break
      default: return
    }
  })


  const rating ={
    overall: parseNumber($(".info-aside-rating-user").text()),
    plot: 0,
    art: 0,
    music: 0,
    characters: 0
  }
  $(".info-aside-overall-rating>li")
  .each(function() {
    const $item = $(this)
    const [grade_string] =$item.text().match(/[\d,]+/) || [""]
    const grade_number =parseNumber(grade_string)

    const _title = $item.find("span").text()
    switch ( _title ) {
      case "Fabuła":    rating.plot =grade_number; break
      case "Grafika":   rating.art =grade_number; break
      case "Muzyka":    rating.music =grade_number; break
      case "Postacie":  rating.characters =grade_number; break
      default: return
    }
  })


  const characters =[] as shindenCharacter[]
  $(".ch-st-list>div").each(function() {
    const $item = $(this)

    characters.push({
      link: $item.find(".item-l h3>a").attr("href") || "",
      name: $item.find(".item-l h3>a").text(),
      image_url: noImageDetector($item.find("img").attr("src") || ""),
      type: $item.find(".item-l p").text(),
      vc: {
        name: $item.find(".item-r a").text(),
        country: $item.find(".item-r p").text(),
        link: $item.find(".item-r a.img").attr("href") || "",
        image_url: noImageDetector($item.find(".item-r a.img img").attr("src") || ""),
      }
    })
  })


  const cast =[] as shindenCast[]
  $(".person-list>div").each(function() {
    const $item = $(this)

    cast.push({
      image_url: noImageDetector($item.find("img").attr("src") || ""),
      name: $item.find("h3>a").text().trim(),
      description: $item.find("p").text().trim(),
    })
  })


  const info_map =new Map() as Map<string,any>
  let i =0
  let last_info:string
  $("dl.info-aside-list").children().each(function() {
    const $item = $(this)
    const caption =$item.text().trim()
    
    i =(i +1) %2
    if ( i === 1 ) {
      switch ( caption ) {
        case "Typ:":              last_info ="type"; break
        case "Status:":           last_info ="status"; break
        case "Koniec emisji:":    last_info ="air_date"; break
        case "Liczba odcinków:":  last_info ="episodes"; break
        case "Studio:":           last_info ="studios"; break
        case "Długość odcinka:":  last_info ="episde_length"; break
        case "MPAA:":             last_info ="mpaa"; break
        default: last_info =""
      }
    }
    else {
      switch ( last_info ) {
        case "": return
        case "episodes": info_map.set(last_info,parseNumber(caption)); break
        case "mpaa": info_map.set(last_info,mpaaToAgeGroup(caption));break
        case "air_date": {
          const [,month,year] =caption.split(".")
          const month_str =getMonthNamePl(parseInt(month))

          info_map.set(last_info,`${month_str} ${year}`)
          info_map.set("full_date",caption)
        }; break
        case "studios": {
          const arr =[] as shindenStudio[]
          $item.children().each(function() {
            const $item = $(this)
            arr.push({
              name:$item.text(),
              link:$item.attr("href") || "",
            })
          })
          info_map.set(last_info,arr)
        } break
        default: info_map.set(last_info,caption)
      }
    }    
  })
  const info =Object.fromEntries(info_map.entries()) as shindenAnimeInfo

  const related =[] as shindenRelatedShow[]
  $(".relation_t2t").each(function() {
    const $item = $(this)
    const link =$item.find("a").attr("href") || ""
    let title =link
    .replace(/\D+\d+-/g,"")
    .replace(/-/g," ")
    .split(" ")
    .map(i => i.substring(0,1).toUpperCase() + i.substring(1))
    .join(" ")
    
    const [,md,t] =$item.text().split("\n").filter(i => i)
    related.push({
      title,link,
      image_url: noImageDetector($item.find("img").attr("src") || ""),
      media: md || "",
      type: t || ""
    })
  })

  const title =$("span.title").text()
  let image_url =noImageDetector($("img.info-aside-img").attr("src") || "")
  const nsfw =areTagsNsfw(tags.genres)
  image_url =await fixImageUrl(image_url,title,nsfw)
  
  return {
    title,
    full_title: $(".title-other").text().replace(/[\n]/g," ").trim().replace(/[,-;]$/,""),
    image_url,
    related,
    description: $("meta[name='description']").attr("content")?.trim() || "",
    tags,rating,characters,cast,info
  }
}