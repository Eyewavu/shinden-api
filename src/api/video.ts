import request from "request"
import { waitFor } from "../utils/wait"
const cookieJar =request.jar()
const auth ="X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D"

const headers ={
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
  "cache-control": "max-age=0",
  "referer": "https://shinden.pl/",
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "same-origin",
  "sec-fetch-user": "?1",
  "sec-gpc": "1",
  "upgrade-insecure-requests": "1",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
}

export async function getVideoLinkShinden ( playerID:string ):Promise<string> {
  const url1 =`https://api4.shinden.pl/xhr/${playerID}/player_load?auth=${auth}`
  const url2 =`https://api4.shinden.pl/xhr/${playerID}/player_show?auth=${auth}&width=0&height=-1`
  
  return new Promise(resolve => {
    request.get({
      url: url1,
      method: "GET",
      jar: cookieJar,
      headers
    },async () => {
      await waitFor(5000)
      request.get({
        url: url2,
        method: "GET",
        jar: cookieJar,
        headers
      },(_,__,body) => {
        const [iframe] =body.match(/<iframe[\s\S]+<\/iframe>/) || [""]
        resolve(iframe)
      })
    })
  })
}