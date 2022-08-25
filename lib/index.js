import { load } from 'cheerio';
import fetch from 'node-fetch';
import request from 'request';

// without those it won't work
const headers$1 = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Cookie": "cb-rodo=enabled;",
    "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en,q=0.7"
};
async function fetchFromShinden(url) {
    const response = await fetch(url, { headers: headers$1 });
    if (!response.ok)
        throw new Error(response.statusText);
    const html_string = await response.text();
    return html_string;
}

// if shinden won't provide any images i scrape them from myanimelist
async function searchImageMal(term) {
    // %20 * 3 is because search queries shorter than 3 characters throw an error
    const res = await fetch(`https://myanimelist.net/search/all?q=${term}%20%20%20`);
    const html = await res.text();
    const $ = load(html);
    const src = $("article img")
        ?.attr("data-src")
        ?.replace(/\?.+/, "")
        ?.replace(/\/r\/\d+x\d+/, "") || "";
    return src;
}

function noImageDetector(url) {
    if (url.includes("/res/other"))
        return "";
    if (url.includes("javascript:"))
        return "";
    return url;
}
const areTagsNsfw = (tags) => tags.map(t => t.toUpperCase())
    .some(t => t === "HENTAI" ||
    t === "YAOI" ||
    t === "YURI");
async function fixImageUrl(image_url, title, nsfw) {
    if (!nsfw) {
        if (!image_url) {
            image_url = await searchImageMal(title);
        }
        else {
            image_url = "https://shinden.pl" + image_url;
        }
    }
    else
        image_url = "https://i.ebayimg.com/images/i/252339513231-0-1/s-l1000.jpg";
    return image_url;
}

function parseNumber(input) {
    const str = input.replace(/,/, ".");
    const n = parseFloat(str);
    return isNaN(n) ? 0 : n;
}

async function scrapeSearchShinden(url) {
    const html = await fetchFromShinden(url);
    const index = html.indexOf("<article>");
    const index2 = html.lastIndexOf("</article>");
    const $ = load(html.substring(index + 9, index2));
    /**
     * Why the FUCK cheerio is not letting me do this with async
     * now i have to do this shit with promise Array
     */
    const promiseArray = [];
    $(".div-row").each(function () {
        const $item = $(this);
        promiseArray.push(new Promise(async (resolve) => {
            const title = $item.find("h3>a").text();
            const tags = $item.find(".tags").text().split("\n").filter(i => i);
            let image_url = noImageDetector($item.find(".cover-col>a").attr("href") || "");
            const nsfw = areTagsNsfw(tags);
            image_url = await fixImageUrl(image_url, title, nsfw);
            resolve({
                title,
                link: $item.find("h3>a").attr('href') || "",
                image_url,
                tags,
                type: $item.find(".title-kind-col").text(),
                episodes: $item.find(".episodes-col").attr("title") || "",
                grade: parseNumber($item.find(".rate-top").text() || "0"),
            });
        }));
    });
    const list = await Promise.all(promiseArray);
    return list;
}

const genres = [["Akcja", 5], ["Cyberpunk", 106], ["Dramat", 8], ["Ecchi", 78], ["Eksperymentalne", 1741], ["Fantasy", 22], ["Harem", 130], ["Hentai", 234], ["Historyczne", 92], ["Horror", 51], ["Komedia", 7], ["Kryminalne", 20], ["Magia", 18], ["Mecha", 98], ["Męski harem", 263], ["Muzyczne", 136], ["Nadprzyrodzone", 19], ["Obłęd", 97], ["Okruchy życia", 42], ["Parodia", 165], ["Przygodowe", 6], ["Psychologiczne", 52], ["Romans", 2672], ["Romans (do rozdzielenia)", 38], ["Sci-Fi", 549], ["Shoujo-ai", 167], ["Shounen-ai", 207], ["Space opera", 384], ["Sportowe", 31], ["Steampunk", 1734], ["Szkolne", 65], ["Sztuki walki", 57], ["Tajemnica", 12], ["Thriller", 53], ["Wojskowe", 93], ["Yaoi", 364], ["Yuri", 380]];
const target = [["Dla dzieci", 218], ["Josei", 39], ["Seinen", 48], ["Shoujo", 128], ["Shounen", 23]];
const characters = [["Aktorzy", 2329], ["Albinos", 2656], ["Androidy", 1758], ["Anioły", 1055], ["Artyści", 1779], ["Arystokracja", 1781], ["Bishoujo", 576], ["Bishounen", 1723], ["Bóstwa", 1805], ["Chibi", 569], ["Chuunibyou", 1842], ["Cyborgi", 1726], ["Czarodzieje", 1922], ["Dandere/Kuudere", 1783], ["Delikwenci", 2347], ["Demony", 104], ["Dere-Dere", 2174], ["Detektywi", 256], ["Doktor", 2217], ["Dorośli", 1760], ["Duchy", 1731], ["Dzieci", 1737], ["Egzorcyści", 1804], ["Elfy", 1762], ["Futanari", 2116], ["GAR", 1797], ["Geniusz", 2755], ["Genki", 2213], ["Gracze", 2325], ["Gyaru", 1807], ["Heterochromia", 2681], ["Hikikomori", 2308], ["Hybryda", 2146], ["Idole", 352], ["Imouto", 1787], ["Insekty", 2356], ["Kapłani", 1780], ["Kemonomimi", 1742], ["Kitsune", 2373], ["Kosmici", 421], ["Koty", 594], ["Lokaje", 1232], ["Loli", 296], ["Magiczne", 1800], ["Mahou shoujo", 173], ["Mayadere", 2005], ["Meganekko", 2214], ["Moe", 519], ["Morderca", 1902], ["Mówiące zwierzęta", 1905], ["Młodzież", 2226], ["Najemnicy", 1916], ["Nauczyciele", 1820], ["NEET", 2190], ["Nekomata", 2650], ["Niewolnicy", 2180], ["Ninja", 59], ["Ochroniarz", 2338], ["OP postać", 2264], ["Otaku", 260], ["Otouto", 2306], ["Piraci", 62], ["Pokojówki", 1747], ["Policjanci", 2222], ["Potwory", 1727], ["Pracownicy biurowi", 1782], ["Przestępcy", 1778], ["Roboty", 1733], ["Rycerze", 1923], ["Samuraje", 108], ["Shinigami", 269], ["Sieroty", 2364], ["Slime", 2751], ["Smoki", 1725], ["Studenci", 1875], ["Superbohaterzy", 2369], ["Syreny", 496], ["Szpiedzy", 2181], ["Tengu", 2626], ["Transwestyta", 2254], ["Tsundere", 1759], ["Uczniowie", 1819], ["Wampiry", 83], ["Wiedźmy", 1728], ["Wilkołaki", 2044], ["Wróżki", 387], ["Władca Demonów", 2383], ["Yandere/Yangire", 1755], ["Youkai", 1744], ["Zamiana płci", 956], ["Zombie", 1075], ["Żołnierze", 2157], ["Zwierzęta", 2632], ["Łowcy nagród", 1761]];
const time_place = [["Alternatywna Ziemia", 2328], ["Ameryka Północna", 1789], ["Budynek mieszkalny", 2336], ["Chiny", 1949], ["Dungeon", 2663], ["Dystopia", 2348], ["Europa", 1745], ["Feudalna Japonia", 1730], ["Jak gra", 2322], ["Jak średniowiecze", 2362], ["Japonia", 1740], ["kawiarnia/restauracja/bar/sklep", 2341], ["Kosmos", 10], ["Miasto", 1785], ["Ocean", 2363], ["Podróż", 1788], ["Postapokaliptyczne", 470], ["Przyszłość", 2326], ["Świat alternatywny", 2327], ["Szkoła dla chłopców", 2333], ["Szkoła dla dziewcząt", 2332], ["W grze / VR", 1729], ["Wieś", 1784], ["Współczesność", 1739], ["Wyspy", 2357]];
const other = [["Alchemia", 450], ["Amnezja", 1901], ["Bejsbol", 506], ["Boks", 67], ["Broń Palna", 2155], ["Buddyzm", 2361], ["Choroba", 2355], ["Crossdressing", 2346], ["Death Game", 1933], ["Dzielenie ciała", 2339], ["Edukacyjne", 558], ["Ekonomia", 1763], ["Eksperymenty na ludziach", 2354], ["Fantastyka współczesna", 2345], ["Gildie", 2351], ["Gimnastyka", 2714], ["Gore", 2050], ["Gra o wysoką stawkę", 2377], ["Gry karciane", 1904], ["Hazard", 2350], ["Isekai", 2376], ["Iyashikei", 2358], ["Kanibalizm", 2739], ["Kazirodztwo", 383], ["Kendo", 554], ["Klub szkolny", 2765], ["Kolarstwo", 1947], ["Koszykówka", 225], ["Kulinaria", 1803], ["Lotnictwo", 1749], ["Mafia", 513], ["Mahjong", 357], ["Manipulacja czasem i przestrzenią", 1840], ["Mitologia chrześcijańska", 2360], ["Mitologia japońska", 2359], ["O grach", 2324], ["Opieka nad dzieckiem", 2342], ["Pan i Sługa", 2770], ["Panty shots", 2365], ["Piłka nożna", 32], ["Pociągi", 2370], ["Podróże w czasie", 2731], ["Przemoc", 1736], ["Reinkarnacja", 2367], ["Rolnictwo", 2331], ["Samochody", 47], ["Samorząd uczniowski", 2411], ["Seks", 1786], ["Siatkówka", 2216], ["Spisek", 2344], ["Strzelaniny", 2352], ["Supermoce", 58], ["Taniec", 2318], ["Tatuaże", 2750], ["Tenis", 66], ["Trójkąt miłosny", 1743], ["Walka wręcz", 2353], ["Wątek romantyczny", 2674], ["Wojna", 1962], ["Wykorzystywanie seksualne", 2368], ["Wyraźny seks", 2349], ["Wyścigi Samochodowe", 1903], ["Yakuza", 1089], ["Zaaranżowany związek", 2337], ["Zamiana ciałami", 1732], ["Zemsta", 2145], ["Znęcanie nad zwierzętami", 2334], ["Znęcanie się", 2340], ["Życie pośmiertne", 2330], ["Łucznictwo", 2335], ["Łyżwiarstwo", 2153]];
const origin = [["Anime", 2314], ["Gra komputerowa", 193], ["Gry (inne)", 2323], ["Inne", 2410], ["Karcianka", 2016], ["Książka", 2029], ["Light novel", 1976], ["Manga", 1956], ["Manga 4-koma", 1996], ["Novel", 2127], ["Seria oryginalna", 1966], ["Visual novel", 1990], ["Web manga", 2025]];
const tagMap = new Map([
    ...genres,
    ...target,
    ...characters,
    ...time_place,
    ...other,
    ...origin,
]);
const tagToId = (input) => tagMap.get(input);

async function advancedSearchShinden(options, query) {
    let url = "https://shinden.pl/series?genres-type=all&genres=";
    if (options) {
        if (options.tags) {
            const include = [];
            const exclude = [];
            Object.values(options.tags)
                .map(i => {
                const { include: _include, exclude: _exclude } = i;
                if (_include)
                    _include.forEach((tag) => include.push(tagToId(tag) || -1));
                if (_exclude)
                    _exclude.forEach((tag) => exclude.push(tagToId(tag) || -1));
            });
            url += include.map(i => "i" + i).join("%3B");
            if (exclude.length > 0)
                url += "%3B";
            url += exclude.map(i => "e" + i).join("%3B");
        }
        if (options.date) {
            if (options.date.precision)
                url += "&start_date_precision=" + options.date.precision;
            if (options.date.from)
                url += "&year_from=" + options.date.from;
            if (options.date.to)
                url += "&year_top=" + options.date.to;
        }
        if (options.type) {
            url += options.type.reduce((acc, v, index) => acc += `&series_type[${index}]=${v}`, "");
        }
        if (options.status) {
            url += options.status.reduce((acc, v, index) => acc += `&series_status[[${index}]=${v.replace(/\s/g, "+")}`, "");
        }
        if (options.episodeLength) {
            const { min, max } = options.episodeLength;
            const paramArray = ["less_7", "7_to_18", "19_to_27", "28_to_48", "over_48"];
            const lenArray = [[0, 7], [7, 18], [19, 27], [28, 48], [48, 999]];
            const testMinArray = [];
            const testMaxArray = [];
            lenArray.forEach(i => {
                testMinArray.push(Math.abs(min - i[0]));
                testMaxArray.push(Math.abs(max - i[1]));
            });
            const minIndex = testMinArray.indexOf(Math.min(...testMinArray));
            const maxIndex = testMaxArray.indexOf(Math.min(...testMaxArray));
            for (let i = minIndex; i <= maxIndex; i++) {
                url += `&series_length[${i - minIndex}]=${paramArray[i]}`;
            }
        }
        if (options.numberOfEpisodes) {
            const { min, max } = options.numberOfEpisodes;
            url += `&series_number[0]=${min}_to_${max}`;
            url += `&series_number_from=${min}`;
            url += `&series_number_to=${max}`;
        }
        if (options.letter)
            url += `&page=${options.letter}`;
        if (options.title)
            url += `&type=${options.title}`;
        if (options.sort) {
            url += `&sort_by=`;
            switch (options.sort.by) {
                case "type":
                    url += "type";
                    break;
                case "episodes":
                    url += "multimedia";
                    break;
                case "status":
                    url += "%3Fsort_by%3Dstatus";
                    break;
                case "rating":
                    url += "ranking-rate";
                    break;
            }
            if (options.sort.order === "Ascending")
                url += "&sort_order=asc";
            else
                url += "&sort_order=desc";
        }
        if (options.page)
            url += `&page=${options.page}`;
    }
    if (query)
        url += `&search=${query}`;
    return scrapeSearchShinden(url);
}

function getMonthNamePl(input) {
    switch (input) {
        case 1: return "Styczeń";
        case 2: return "Luty";
        case 3: return "Marzec";
        case 4: return "Kwiecień";
        case 5: return "Maj";
        case 6: return "Czerwiec";
        case 7: return "Lipiec";
        case 8: return "Sierpień";
        case 9: return "Wrzesień";
        case 10: return "Październik";
        case 11: return "Listopad";
        case 12: return "Grudzień";
    }
}

function mpaaToAgeGroup(input) {
    switch (input.toUpperCase()) {
        case "G": return "All";
        case "PG": return "7+";
        case "PG-13": return "13+";
        case "R":
        case "R+": return "16+";
        case "NC-17":
        case "RY": return "18+";
    }
}

async function scrapeAnimeInfoShinden(url) {
    const html = await fetchFromShinden(`https://shinden.pl${url}`);
    const $ = load(html);
    const tags = {
        genres: [],
        target: [],
        characters: [],
        time_place: [],
        origin: [],
        other: []
    };
    $(".info-top-table-highlight").find(".tags").each(function () {
        const $item = $(this);
        const _tags = $item.parent().parent().before().text().trim().split(/\n+\s?/);
        const category = _tags.shift();
        switch (category) {
            case "Gatunki:":
                tags.genres = [..._tags];
                break;
            case "Grupy docelowe:":
                tags.target = [..._tags];
                break;
            case "Rodzaje postaci:":
                tags.characters = [..._tags];
                break;
            case "Miejsce i czas:":
                tags.time_place = [..._tags];
                break;
            case "Pierwowzór:":
                tags.origin = [..._tags];
                break;
            case "Pozostałe tagi:":
                tags.other = [..._tags];
                break;
            default: return;
        }
    });
    const rating = {
        overall: parseNumber($(".info-aside-rating-user").text()),
        plot: 0,
        art: 0,
        music: 0,
        characters: 0
    };
    $(".info-aside-overall-rating>li")
        .each(function () {
        const $item = $(this);
        const [grade_string] = $item.text().match(/[\d,]+/) || [""];
        const grade_number = parseNumber(grade_string);
        const _title = $item.find("span").text();
        switch (_title) {
            case "Fabuła":
                rating.plot = grade_number;
                break;
            case "Grafika":
                rating.art = grade_number;
                break;
            case "Muzyka":
                rating.music = grade_number;
                break;
            case "Postacie":
                rating.characters = grade_number;
                break;
            default: return;
        }
    });
    const characters = [];
    $(".ch-st-list>div").each(function () {
        const $item = $(this);
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
        });
    });
    const cast = [];
    $(".person-list>div").each(function () {
        const $item = $(this);
        cast.push({
            image_url: noImageDetector($item.find("img").attr("src") || ""),
            name: $item.find("h3>a").text().trim(),
            description: $item.find("p").text().trim(),
        });
    });
    const info_map = new Map();
    let i = 0;
    let last_info;
    $("dl.info-aside-list").children().each(function () {
        const $item = $(this);
        const caption = $item.text().trim();
        i = (i + 1) % 2;
        if (i === 1) {
            switch (caption) {
                case "Typ:":
                    last_info = "type";
                    break;
                case "Status:":
                    last_info = "status";
                    break;
                case "Koniec emisji:":
                    last_info = "air_date";
                    break;
                case "Liczba odcinków:":
                    last_info = "episodes";
                    break;
                case "Studio:":
                    last_info = "studios";
                    break;
                case "Długość odcinka:":
                    last_info = "episde_length";
                    break;
                case "MPAA:":
                    last_info = "mpaa";
                    break;
                default: last_info = "";
            }
        }
        else {
            switch (last_info) {
                case "": return;
                case "episodes":
                    info_map.set(last_info, parseNumber(caption));
                    break;
                case "mpaa":
                    info_map.set(last_info, mpaaToAgeGroup(caption));
                    break;
                case "air_date":
                    {
                        const [, month, year] = caption.split(".");
                        const month_str = getMonthNamePl(parseInt(month));
                        info_map.set(last_info, `${month_str} ${year}`);
                        info_map.set("full_date", caption);
                    }
                    break;
                case "studios":
                    {
                        const arr = [];
                        $item.children().each(function () {
                            const $item = $(this);
                            arr.push({
                                name: $item.text(),
                                link: $item.attr("href") || "",
                            });
                        });
                        info_map.set(last_info, arr);
                    }
                    break;
                default: info_map.set(last_info, caption);
            }
        }
    });
    const info = Object.fromEntries(info_map.entries());
    const related = [];
    $(".relation_t2t").each(function () {
        const $item = $(this);
        const link = $item.find("a").attr("href") || "";
        let title = link
            .replace(/\D+\d+-/g, "")
            .replace(/-/g, " ")
            .split(" ")
            .map(i => i.substring(0, 1).toUpperCase() + i.substring(1))
            .join(" ");
        const [, md, t] = $item.text().split("\n").filter(i => i);
        related.push({
            title, link,
            image_url: noImageDetector($item.find("img").attr("src") || ""),
            media: md || "",
            type: t || ""
        });
    });
    const title = $("span.title").text();
    let image_url = noImageDetector($("img.info-aside-img").attr("src") || "");
    const nsfw = areTagsNsfw(tags.genres);
    image_url = await fixImageUrl(image_url, title, nsfw);
    return {
        title,
        full_title: $(".title-other").text().replace(/[\n]/g, " ").trim().replace(/[,-;]$/, ""),
        image_url,
        related,
        description: $("meta[name='description']").attr("content")?.trim() || "",
        tags, rating, characters, cast, info
    };
}

async function scrapeAllEpisodesShinden(link) {
    const html = await fetchFromShinden(`https://shinden.pl${link}/episodes`);
    const index1 = html.indexOf("table");
    const index2 = html.lastIndexOf("/table");
    const $ = load(html.substring(index1 - 6, index2 + 7));
    const list = [];
    $(".list-episode-checkboxes>tr").each(function () {
        const $item = $(this);
        list.push({
            link: $item.find("a").attr("href") || "",
            name: $item.find(".ep-title").text(),
            date: $item.find(".ep-date").text(),
            id: parseInt($item.find("td:nth-child(1)").text()),
            lang: $item.find(".flag-icon").parent().html()?.match(/(?<=title=").+(?=">)/g) || [],
            avaiable: !!$item.find("i").attr("class")?.includes("fa-check")
        });
    });
    list.sort((a, b) => a.id - b.id);
    return list;
}

async function scrapeVideoPlayerIdsShinden(link) {
    const html = await fetchFromShinden(`https://shinden.pl${link}`);
    const index1 = html.indexOf("episode-player-list");
    const index2 = html.lastIndexOf("player-navigator-section box");
    const $ = load(html.substring(index1 - 20, index2 - 17));
    const list = [];
    $("tbody >tr").each(function () {
        const $item = $(this);
        list.push({
            source: $item.find(".ep-pl-name").text(),
            quality: $item.find(".ep-pl-res").text(),
            dub_lang: $item.find(".ep-pl-alang").text().replace(/\s/g, ""),
            sub_lang: $item.find(".ep-pl-slang").text().replace(/\s/g, ""),
            id: $item.find(".ep-buttons a").attr("id")?.replace(/player_data_/, "") || ""
        });
    });
    return list;
}

async function searchShinden(query) {
    return scrapeSearchShinden("https://shinden.pl/series?search=" + encodeURIComponent(query));
}

async function waitFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const cookieJar = request.jar();
const auth = "X2d1ZXN0XzowLDUsMjEwMDAwMDAsMjU1LDQxNzQyOTM2NDQ%3D";
const headers = {
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
};
async function getVideoLinkShinden(playerID) {
    const url1 = `https://api4.shinden.pl/xhr/${playerID}/player_load?auth=${auth}`;
    const url2 = `https://api4.shinden.pl/xhr/${playerID}/player_show?auth=${auth}&width=0&height=-1`;
    return new Promise(resolve => {
        request.get({
            url: url1,
            method: "GET",
            jar: cookieJar,
            headers
        }, async () => {
            await waitFor(5000);
            request.get({
                url: url2,
                method: "GET",
                jar: cookieJar,
                headers
            }, (_, __, body) => {
                const [iframe] = body.match(/<iframe[\s\S]+<\/iframe>/) || [""];
                resolve(iframe);
            });
        });
    });
}

export { advancedSearchShinden, getVideoLinkShinden, scrapeAllEpisodesShinden, scrapeAnimeInfoShinden, scrapeVideoPlayerIdsShinden, searchShinden };
//# sourceMappingURL=index.js.map
