import { scrapeSearchShinden } from "./search"
import { allTagsCombined, shindenTagCharacters, shindenTagGenre, shindenTagOther, shindenTagTarget, shindenTagtimePlace, tagToId } from "./tags"



type optionTags<Tag> ={
  include:Tag[],
  exclude:Tag[]
}
type seriesType ="TV"|"ONA"|"Movie"|"Special"|"Music"
type seriesStatus ="Proposal"|"Not yet aired"|"Currently Airing"|"Finished Airing"

export interface shindenAdvancedSearchOptions {
  tags?: {
    genres?: optionTags<shindenTagGenre>,
    target?: optionTags<shindenTagTarget>,
    characters?: optionTags<shindenTagCharacters>,
    time_place?: optionTags<shindenTagtimePlace>,
    other?: optionTags<shindenTagOther>,
    origin?: optionTags<shindenTagOther>,
  },
  date: {
    /*** format yyyy-mm-dd*/
    from?: string,
    /*** format yyyy-mm-dd*/
    to?: string,
    /**
     * * precision 3 - year,month,day
     * *  precision 2 - year,month
     * *  precision 1 - year
     * 
     */
    precision?:3|2|1
  },
  type?: seriesType[],
  status?: seriesStatus[],
  /*** episode length in minutes*/
  episodeLength?:{
    /*** episode length in minutes*/
    min:number,
    /*** episode length in minutes*/
    max:number
  },
  numberOfEpisodes?:{
    min:number,
    max:number
  },
  letter:"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"|"1",
  title:"contains"|"equals",
  sort: {
    by:"type"|"episodes"|"status"|"rating",
    // by:"type"|"multimedia"|"%3Fsort_by%3Dstatus"|"ranking-rate",
    order?:"Descending"|"Ascending"
  }
  page?:number
}


export async function advancedSearchShinden(options?:shindenAdvancedSearchOptions,query?:string) {
  let url ="https://shinden.pl/series?genres-type=all&genres="
  if ( options ) {
    if ( options.tags ) {
      
      const include:number[] =[]
      const exclude:number[] =[]
      Object.values(options.tags)
      .map(i => {
        const {include:_include, exclude:_exclude} =i

        if ( _include ) _include.forEach((tag:allTagsCombined) => include.push(tagToId(tag) || -1))
        if ( _exclude ) _exclude.forEach((tag:allTagsCombined) => exclude.push(tagToId(tag) || -1))
      })

      include.filter(i => i >= 0)
      exclude.filter(i => i >= 0)
      
      url += include.map(i => "i"+i).join("%3B")
      if ( exclude.length > 0 ) url += "%3B"
      url += exclude.map(i => "e"+i).join("%3B")

    }
    
    if ( options.date ) {
      if ( options.date.precision ) url += "&start_date_precision=" +options.date.precision
      if ( options.date.from ) url += "&year_from=" +options.date.from
      if ( options.date.to ) url += "&year_top=" +options.date.to
      
    }
    if ( options.type ) {
      url += options.type.reduce((acc,v,index) => acc += `&series_type[${index}]=${v}`,"")
    }
    if ( options.status ) {
      url += options.status.reduce((acc,v,index) => acc += `&series_status[[${index}]=${v.replace(/\s/g,"+")}`,"")
    }
    if ( options.episodeLength ) {
      const {min,max} =options.episodeLength

      const paramArray =["less_7","7_to_18","19_to_27","28_to_48","over_48"]
      const lenArray =[[0,7],[7,18],[19,27],[28,48],[48,999]]
      const testMinArray:number[] =[]
      const testMaxArray:number[] =[]

      lenArray.forEach(i => {
        testMinArray.push(Math.abs(min -i[0]))
        testMaxArray.push(Math.abs(max -i[1]))
      })
      const minIndex =testMinArray.indexOf(Math.min(...testMinArray))
      const maxIndex =testMaxArray.indexOf(Math.min(...testMaxArray))
      
      for ( let i =minIndex; i <=maxIndex; i++ ) {
        url += `&series_length[${i - minIndex}]=${paramArray[i]}`
      }  
    }
    if ( options.numberOfEpisodes ) {
      const {min,max} =options.numberOfEpisodes
      url += `&series_number[0]=${min}_to_${max}`
      url += `&series_number_from=${min}`
      url += `&series_number_to=${max}`
    }
    if ( options.letter ) url += `&page=${options.letter}`
    if ( options.title ) url += `&type=${options.title}`
    if ( options.sort ) {
      url += `&sort_by=`
      switch ( options.sort.by ) {
        case "type": url += "type"; break;
        case "episodes": url += "multimedia"; break;
        case "status": url += "%3Fsort_by%3Dstatus"; break;
        case "rating": url += "ranking-rate"; break;
      }

      if ( options.sort.order === "Ascending" ) url += "&sort_order=asc"
      else url += "&sort_order=desc"
    }

    if ( options.page ) url += `&page=${options.page}`
  }

  if ( query ) url += `&search=${query}`
  
  return scrapeSearchShinden(url)
}
