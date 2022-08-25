import { scrapeSearchShinden } from "./search"

export async function searchShinden(query:string) {
  return scrapeSearchShinden("https://shinden.pl/series?search=" +encodeURIComponent(query))
}