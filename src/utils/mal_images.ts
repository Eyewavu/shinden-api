import { load } from "cheerio"
import fetch from "node-fetch"

// if shinden won't provide any images i scrape them from myanimelist
export async function searchImageMal(term:string) {
  // %20 * 3 is because search queries shorter than 3 characters throw an error
  const res =await fetch(`https://myanimelist.net/search/all?q=${term}%20%20%20`)
  const html =await res.text()

  const $ =load(html)
  const src =$("article img")
  ?.attr("data-src")
  ?.replace(/\?.+/,"")
  ?.replace(/\/r\/\d+x\d+/,"") || ""

  return src
}