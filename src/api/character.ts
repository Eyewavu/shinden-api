import { load } from "cheerio";
import { fetchRawHtml } from "src/utils/fetch";

export interface shindenVoiceActor {
  name: string;
  link: string;
  image_url: string;
  lang: string
}

export interface shindenHistoryItem {
  image_url:string;
  title:string;
  type:string;
  date:string;
  role:string;
}

export async function scrapeCharacterShinden(link:string){
  const html =await fetchRawHtml(`https://shinden.pl`+link)
  const $ =load(html)

  let info_list:[string, string][] =[]
  let attr:string[] =[]
  let i =0;
  $(".data-view-table td").each(function(){
    const $item = $(this)
    const _switch =++i %2

    const text =_switch === 1 ?
    $item.text().replace(":","").trim() :
    $item.text()
    
    attr.push(text)
    if ( _switch === 0 ) {
      const tup:[string,string] =[attr[0],attr[1]]
      info_list.push(tup)
      attr =[]
    }
  })

  const va_list:shindenVoiceActor[] =[]
  $("span.person").each(function(){
    const $item = $(this)

    va_list.push({
      name:$item.find("a:nth-child(1)").text(),
      link:$item.find("a:nth-child(1)").attr("href") || "",
      image_url:$item.find("img").attr("src") || "",
      lang:$item.find("p").text() || ""
    })
  })

  const h_list:shindenHistoryItem[] =[]
  $("li.event.media").each(function(){
    const $item = $(this)
    const text =$item.find(".bd").text()
    
    const date =(text.match(/(?<=wydania:).+/) || [""])[0].trim()
    const role =(text.match(/(?<=Rola:).+/) || [""])[0].trim()

    h_list.push({
      title:$item.find("a").text(),
      image_url:$item.find("img").attr("src") || "",
      type:$item.find("h4").text().replace(/:.+/,"").replace(/\s/g,""),
      date,role
    })
  })

  return {
    name: $("h1.page-title").text().replace("Postać:","").trim(),
    image_url: $("img.info-aside-img").attr("src"),
    info:info_list,
    voice_actors: va_list,
    history:h_list
  }
}