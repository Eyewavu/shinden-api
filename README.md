# shinden-api
[![npm version](https://img.shields.io/npm/v/shinden-api)](https://www.npmjs.com/package/shinden-api)
[![npm downloads](https://img.shields.io/npm/dt/shinden-api)](https://www.npmjs.com/package/shinden-api)

Unofficial api for scraping *almost all possible data from shinden.pl


## Installation
```bash
yarn add shinden-api
```
```bash
npm i shinden-api
```

## Examples

### Searching
```js
import { searchShinden } from "shinden-api"

searchShinden("naturo")
.then(arr => console.log(arr[0]))
/*
  {
    title: 'Naruto',
    link: '/series/11-naruto',
    image_url: 'https://shinden.pl/res/images/genuine/171942.jpg',
    tags: [
      'Akcja',
      'Przygodowe',
      'Komedia',
      'Dramat',
      'Fantasy',
      'Sztuki walki'
    ],
    type: 'TV',
    episodes: '220 x 23min',
    grade: 8.17
  }
*/
```

```js
import { advancedSearchShinden } from "shinden-api"

advancedSearchShinden({
  tags: {
    genres: {
      include: ["Akcja"],
      exclude: ["Horror"]
    },
    time_place: {
      include: ["Jak gra"]
    }
  },
  date: {
    from: "2018-01-01"
  },
  sort: {
    by: "rating"
  }
})
.then(res => console.log(res[0]))

/*
{
  title: 'Tate no Yuusha no Nariagari',
  link: '/series/51100-tate-no-yuusha-no-nariagari',
  image_url: 'https://shinden.pl/res/images/genuine/242083.jpg',
  tags: [ 'Akcja', 'Przygodowe', 'Dramat', ' Magia', 'Fantasy' ],
  type: 'TV',
  episodes: '25 x 24min',
  grade: 8.65
}
*/
```

### Series Info

```js
import { scrapeAnimeInfoShinden } from "shinden-api";


scrapeAnimeInfoShinden("/series/53777-kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen")
.then(console.log)

/*
{
  title: 'Kaguya-sama wa Kokurasetai ...',
  full_title: 'Kaguya-sama: Love is War, ...',
  image_url: 'https://shinden.pl/res/images/225x350/240278.jpg',
  related: [
    {
      title: 'Kaguya Sama Wa Kokurasetai Tensai Tachi No Renai Zunousen',
      link: '/series/55673-kaguya-sama-wa-kokurasetai-tensai-tachi-no-renai-zunousen',
      image_url: '/res/images/100x100/262621.jpg',
      media: 'Anime',
      type: 'Sequel'
    }
    ...
  ],
  description: 'Geniusz, posiadający najwyższe oceny w kraju, Miyuki Shirogane ...',
  tags: {
    genres: ['Komedia','Okruchy życia',...],
    target: [ 'Seinen' ],
    characters: ['Pokojówki','Tsundere','Uczniowie'],
    time_place: ['Współczesność','Japonia'],
    origin: ['Manga'],
    other: ['Samorząd uczniowski']
  },
  rating: {
    overall: 8.27,
    plot: 8.17,
    art: 8.34,
    music: 7.9,
    characters: 8.62
  },
  characters: [
    {
      link: '/character/81903-fujiwara-chika',
      name: 'Fujiwara, Chika',
      image_url: '/res/images/36x48/248677.jpg',
      type: 'Główna',
      "vc": {
        "name": "Asakura, Momo",
        "country": "jp",
        "link": "/staff/21449-asakura-momo",
        "image_url": "/res/images/36x48/199070.jpg"
      }
    }
    ...
  ],
  cast: [
    {
      image_url: '/res/images/36x48/279605.jpg',
      name: 'halca',
      description: 'Wykonawca Piosenki Przewodniej'
    }
    ...
  ],
  info: {
    type: 'TV',
    status: 'Zakończone',
    air_date: 'Marzec 2019',
    full_date: '30.03.2019',
    episodes: 12,
    studios: [
      {
        "name": "Aniplex",
        "link": "/studio/56-aniplex"
      }
      ...
    ],
    episde_length: '23min',
    mpaa: '13+'
  }
}
*/

```

### Character Info
```js
import { scrapeCharacterShinden } from "shinden-api";

scrapeCharacterShinden("/character/39834-saitama")
.then(console.log)

/*
{
  name: 'Saitama',
  image_url: '/res/images/225x350/298312.jpg',
  info: [
    ['Imię', 'Saitama'],
    ['Płeć', 'mężczyzna'],
    ['Wiek', '25'],
    ['Historyczna', 'nie'],
    ['Wzrost', '175cm'],
    ['Waga', '70kg'],
    ['Biografia', 'Saitama to główny bohater ...']
  ],
  voice_actors: [
    {
      name: 'Furukawa, Makoto',
      link: '/staff/14491-furukawa-makoto',
      image_url: '/res/images/36x48/340001.jpg',
      lang: 'Japoński'
    },
    {
      name: 'Mittelman, Max',
      link: '/staff/23281-mittelman-max',
      image_url: '/res/images/36x48/273098.jpg',
      lang: 'Angielski'
    }
  ],
  history: [
    {
      title: 'One Punch Man 2nd Season Specials',
      image_url: '/res/images/36x48/255523.jpg',
      type: 'Anime',
      date: '25.10.2019',
      role: 'Main'
    }
    ...
  ]
}
*/
```

### Episode Links
```js
import { scrapeAllEpisodesShinden } from "shinden-api";

scrapeAllEpisodesShinden("/series/51227-darling-in-the-franxx")
.then(console.log)

/*
[
  {
    link: '/episode/51227-darling-in-the-franxx/view/163177',
    name: 'Samotny i Jeszcze Raz Samotny',
    date: '2018-01-13',
    id: 1,
    lang: [ 'Polski', 'Japoński', 'Angielski' ],
    avaiable: true
  }
  ...
]
*/
```

### Episode Video Player IDs
```js
import { scrapeVideoPlayerIdsShinden } from "shinden-api";

scrapeVideoPlayerIdsShinden("/episode/51227-darling-in-the-franxx/view/163177")
.then(console.log)

/*
[
  {
    source: 'Sibnet',
    quality: '720p',
    dub_lang: 'Japoński',
    sub_lang: 'Polski',
    id: '12...'
  }
  ...
]
*/
```

### Video Links
```js
import { getVideoLinkShinden } from "shinden-api";

getVideoLinkShinden("80...")
.then(console.log)

/*
  <iframe 
    src="//ebd.cda.pl/800x450/560..."
    width="800" height="450"
    style="border:none;"
    scrolling="no"
    allowfullscreen
    name="v2"
  >
  </iframe>
*/
```