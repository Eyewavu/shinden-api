import { default as fetch } from "node-fetch";

// without those it won't work
const headers ={
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "Cookie": "cb-rodo=enabled;",
  "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en,q=0.7"
}

export async function fetchRawHtml(url: string):Promise<string> {
  const response =await fetch(url,{headers})
  if ( !response.ok ) throw new Error(response.statusText)

  const html_string =await response.text()
  return html_string
}