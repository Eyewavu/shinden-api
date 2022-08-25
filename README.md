# shinden-api

unofficial api for scraping *almost all possible data from shinden.pl

examples
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
import { getVideoLinkShinden } from "shinden-api"

getVideoLinkShinden("id")
.then(console.log)
/*
  <iframe src="//ebd.cda.pl/800x450/numbers" width="800" height="450" style="border:none;" scrolling="no" allowfullscreen name="v2"></iframe>
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