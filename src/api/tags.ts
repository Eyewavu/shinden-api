const genres =[["Akcja",5],["Cyberpunk",106],["Dramat",8],["Ecchi",78],["Eksperymentalne",1741],["Fantasy",22],["Harem",130],["Hentai",234],["Historyczne",92],["Horror",51],["Komedia",7],["Kryminalne",20],["Magia",18],["Mecha",98],["Męski harem",263],["Muzyczne",136],["Nadprzyrodzone",19],["Obłęd",97],["Okruchy życia",42],["Parodia",165],["Przygodowe",6],["Psychologiczne",52],["Romans",2672],["Romans (do rozdzielenia)",38],["Sci-Fi",549],["Shoujo-ai",167],["Shounen-ai",207],["Space opera",384],["Sportowe",31],["Steampunk",1734],["Szkolne",65],["Sztuki walki",57],["Tajemnica",12],["Thriller",53],["Wojskowe",93],["Yaoi",364],["Yuri",380]] as const
export type shindenTagGenre =(typeof genres)[number][0]

const target =[["Dla dzieci",218],["Josei",39],["Seinen",48],["Shoujo",128],["Shounen",23]] as const
export type shindenTagTarget = (typeof target)[number][0]

const characters =[["Aktorzy",2329],["Albinos",2656],["Androidy",1758],["Anioły",1055],["Artyści",1779],["Arystokracja",1781],["Bishoujo",576],["Bishounen",1723],["Bóstwa",1805],["Chibi",569],["Chuunibyou",1842],["Cyborgi",1726],["Czarodzieje",1922],["Dandere/Kuudere",1783],["Delikwenci",2347],["Demony",104],["Dere-Dere",2174],["Detektywi",256],["Doktor",2217],["Dorośli",1760],["Duchy",1731],["Dzieci",1737],["Egzorcyści",1804],["Elfy",1762],["Futanari",2116],["GAR",1797],["Geniusz",2755],["Genki",2213],["Gracze",2325],["Gyaru",1807],["Heterochromia",2681],["Hikikomori",2308],["Hybryda",2146],["Idole",352],["Imouto",1787],["Insekty",2356],["Kapłani",1780],["Kemonomimi",1742],["Kitsune",2373],["Kosmici",421],["Koty",594],["Lokaje",1232],["Loli",296],["Magiczne",1800],["Mahou shoujo",173],["Mayadere",2005],["Meganekko",2214],["Moe",519],["Morderca",1902],["Mówiące zwierzęta",1905],["Młodzież",2226],["Najemnicy",1916],["Nauczyciele",1820],["NEET",2190],["Nekomata",2650],["Niewolnicy",2180],["Ninja",59],["Ochroniarz",2338],["OP postać",2264],["Otaku",260],["Otouto",2306],["Piraci",62],["Pokojówki",1747],["Policjanci",2222],["Potwory",1727],["Pracownicy biurowi",1782],["Przestępcy",1778],["Roboty",1733],["Rycerze",1923],["Samuraje",108],["Shinigami",269],["Sieroty",2364],["Slime",2751],["Smoki",1725],["Studenci",1875],["Superbohaterzy",2369],["Syreny",496],["Szpiedzy",2181],["Tengu",2626],["Transwestyta",2254],["Tsundere",1759],["Uczniowie",1819],["Wampiry",83],["Wiedźmy",1728],["Wilkołaki",2044],["Wróżki",387],["Władca Demonów",2383],["Yandere/Yangire",1755],["Youkai",1744],["Zamiana płci",956],["Zombie",1075],["Żołnierze",2157],["Zwierzęta",2632],["Łowcy nagród",1761]] as const
export type shindenTagCharacters =(typeof characters)[number][0]

const time_place =[["Alternatywna Ziemia",2328],["Ameryka Północna",1789],["Budynek mieszkalny",2336],["Chiny",1949],["Dungeon",2663],["Dystopia",2348],["Europa",1745],["Feudalna Japonia",1730],["Jak gra",2322],["Jak średniowiecze",2362],["Japonia",1740],["kawiarnia/restauracja/bar/sklep",2341],["Kosmos",10],["Miasto",1785],["Ocean",2363],["Podróż",1788],["Postapokaliptyczne",470],["Przyszłość",2326],["Świat alternatywny",2327],["Szkoła dla chłopców",2333],["Szkoła dla dziewcząt",2332],["W grze / VR",1729],["Wieś",1784],["Współczesność",1739],["Wyspy",2357]] as const
export type shindenTagtimePlace = (typeof time_place)[number][0]

const other =[["Alchemia",450],["Amnezja",1901],["Bejsbol",506],["Boks",67],["Broń Palna",2155],["Buddyzm",2361],["Choroba",2355],["Crossdressing",2346],["Death Game",1933],["Dzielenie ciała",2339],["Edukacyjne",558],["Ekonomia",1763],["Eksperymenty na ludziach",2354],["Fantastyka współczesna",2345],["Gildie",2351],["Gimnastyka",2714],["Gore",2050],["Gra o wysoką stawkę",2377],["Gry karciane",1904],["Hazard",2350],["Isekai",2376],["Iyashikei",2358],["Kanibalizm",2739],["Kazirodztwo",383],["Kendo",554],["Klub szkolny",2765],["Kolarstwo",1947],["Koszykówka",225],["Kulinaria",1803],["Lotnictwo",1749],["Mafia",513],["Mahjong",357],["Manipulacja czasem i przestrzenią",1840],["Mitologia chrześcijańska",2360],["Mitologia japońska",2359],["O grach",2324],["Opieka nad dzieckiem",2342],["Pan i Sługa",2770],["Panty shots",2365],["Piłka nożna",32],["Pociągi",2370],["Podróże w czasie",2731],["Przemoc",1736],["Reinkarnacja",2367],["Rolnictwo",2331],["Samochody",47],["Samorząd uczniowski",2411],["Seks",1786],["Siatkówka",2216],["Spisek",2344],["Strzelaniny",2352],["Supermoce",58],["Taniec",2318],["Tatuaże",2750],["Tenis",66],["Trójkąt miłosny",1743],["Walka wręcz",2353],["Wątek romantyczny",2674],["Wojna",1962],["Wykorzystywanie seksualne",2368],["Wyraźny seks",2349],["Wyścigi Samochodowe",1903],["Yakuza",1089],["Zaaranżowany związek",2337],["Zamiana ciałami",1732],["Zemsta",2145],["Znęcanie nad zwierzętami",2334],["Znęcanie się",2340],["Życie pośmiertne",2330],["Łucznictwo",2335],["Łyżwiarstwo",2153]] as const
export type shindenTagOther =(typeof other)[number][0]

const origin =[["Anime",2314],["Gra komputerowa",193],["Gry (inne)",2323],["Inne",2410],["Karcianka",2016],["Książka",2029],["Light novel",1976],["Manga",1956],["Manga 4-koma",1996],["Novel",2127],["Seria oryginalna",1966],["Visual novel",1990],["Web manga",2025]] as const
export type shindenTagOrigin = (typeof other)[number]

export type allTagsCombined =shindenTagGenre|shindenTagTarget|shindenTagCharacters|shindenTagtimePlace|shindenTagOther|shindenTagOrigin

const tagMap =new Map<allTagsCombined,number>(<[allTagsCombined,number][]>[
  ...genres,
  ...target,
  ...characters,
  ...time_place,
  ...other,
  ...origin,
])

export const tagToId =(input:allTagsCombined):number|undefined =>
tagMap.get(input)