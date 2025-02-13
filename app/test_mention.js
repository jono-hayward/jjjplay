import 'dotenv/config';
import { parse } from './helpers.js';
import { compose } from './compose.js';

const config = {
    station: process.env.STATION,
    timezone: process.env.TIMEZONE,
};

const data = {
    "entity": "Play",
    "arid": "mpneVOWzYL",
    "played_time": "2025-02-09T22:34:24+00:00",
    "service_id": "triplej",
    "recording": {
      "entity": "Recording",
      "arid": "mt9kWvN1QY",
      "title": "Please Don't Move To Melbourne",
      "metadata": null,
      "description": null,
      "duration": 288,
      "artists": [
        {
          "entity": "Artist",
          "arid": "mamQeORVY1",
          "name": "Ball Park Music",
          "artwork": [],
          "links": [
            {
              "entity": "Link",
              "arid": "mlGyQap4yD",
              "url": "https://www.abc.net.au/triplejunearthed/artist/ball-park-music/",
              "id_component": "62036",
              "title": "Unearthed artist",
              "mini_synopsis": null,
              "short_synopsis": null,
              "medium_synopsis": null,
              "type": "service",
              "provider": "unearthed",
              "external": false
            }
          ],
          "is_australian": null,
          "type": "primary",
          "role": null
        }
      ],
      "releases": [
        {
          "entity": "Release",
          "arid": "mrgyj0P86A",
          "title": "Please Don't Move To Melbourne",
          "format": "Single",
          "artwork": [
            {
              "entity": "Artwork",
              "arid": "mi1g5pYmmP",
              "url": "https://www.abc.net.au/triplej/albums/ballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "type": "cover",
              "title": null,
              "mini_synopsis": null,
              "short_synopsis": null,
              "medium_synopsis": null,
              "width": 1000,
              "height": 1000,
              "sizes": [
                {
                  "url": "https://resize.abcradio.net.au/dDs2md9Gb-3wlROoZJEtrM5TKqQ=/100x100/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 100,
                  "height": 100,
                  "aspect_ratio": "1x1"
                },
                {
                  "url": "https://resize.abcradio.net.au/1QtItkcEuAqpWmwXwNYTq_Un0LI=/160x160/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 160,
                  "height": 160,
                  "aspect_ratio": "1x1"
                },
                {
                  "url": "https://resize.abcradio.net.au/1BvemMryapkiy1s2XV4UW71NcLY=/340x340/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 340,
                  "height": 340,
                  "aspect_ratio": "1x1"
                },
                {
                  "url": "https://resize.abcradio.net.au/iMOnYjemnZ1ph0OSUgvn3202_Zw=/580x580/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 580,
                  "height": 580,
                  "aspect_ratio": "1x1"
                },
                {
                  "url": "https://resize.abcradio.net.au/aTPB_eyQqO10dnrl3ftO_L9npT4=/940x940/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 940,
                  "height": 940,
                  "aspect_ratio": "1x1"
                },
                {
                  "url": "https://resize.abcradio.net.au/pkiG4N0xGJyKakV2XfW7SJa9TXU=/100x75/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 100,
                  "height": 75,
                  "aspect_ratio": "4x3"
                },
                {
                  "url": "https://resize.abcradio.net.au/XSnSE8GxfSyHpL3emiEfNDD90I0=/160x120/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 160,
                  "height": 120,
                  "aspect_ratio": "4x3"
                },
                {
                  "url": "https://resize.abcradio.net.au/CSRv21kyzRIx_StNXFmHpsnesvg=/220x124/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 220,
                  "height": 124,
                  "aspect_ratio": "16x9"
                },
                {
                  "url": "https://resize.abcradio.net.au/LSTrhFInGXYbap1eruXRzuM7nWs=/580x326/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 580,
                  "height": 326,
                  "aspect_ratio": "16x9"
                },
                {
                  "url": "https://resize.abcradio.net.au/FGKleTgypSZVmEC_K7W7BSukjjQ=/940x529/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
                  "width": 940,
                  "height": 529,
                  "aspect_ratio": "16x9"
                }
              ],
              "is_primary": null
            }
          ],
          "links": [],
          "artists": [
            {
              "entity": "Artist",
              "arid": "mamQeORVY1",
              "name": "Ball Park Music",
              "artwork": [],
              "links": [
                {
                  "entity": "Link",
                  "arid": "mlGyQap4yD",
                  "url": "https://www.abc.net.au/triplejunearthed/artist/ball-park-music/",
                  "id_component": "62036",
                  "title": "Unearthed artist",
                  "mini_synopsis": null,
                  "short_synopsis": null,
                  "medium_synopsis": null,
                  "type": "service",
                  "provider": "unearthed",
                  "external": false
                }
              ],
              "is_australian": null,
              "type": "primary",
              "role": null
            }
          ],
          "record_label": null,
          "release_year": "2025",
          "release_album_id": null,
          "is_primary": null
        }
      ],
      "artwork": [],
      "links": []
    },
    "release": {
      "entity": "Release",
      "arid": "mrgyj0P86A",
      "title": "Please Don't Move To Melbourne",
      "format": "Single",
      "artwork": [
        {
          "entity": "Artwork",
          "arid": "mi1g5pYmmP",
          "url": "https://www.abc.net.au/triplej/albums/ballparkmusic-pleasedontmovetomelbournesingle.jpg",
          "type": "cover",
          "title": null,
          "mini_synopsis": null,
          "short_synopsis": null,
          "medium_synopsis": null,
          "width": 1000,
          "height": 1000,
          "sizes": [
            {
              "url": "https://resize.abcradio.net.au/dDs2md9Gb-3wlROoZJEtrM5TKqQ=/100x100/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 100,
              "height": 100,
              "aspect_ratio": "1x1"
            },
            {
              "url": "https://resize.abcradio.net.au/1QtItkcEuAqpWmwXwNYTq_Un0LI=/160x160/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 160,
              "height": 160,
              "aspect_ratio": "1x1"
            },
            {
              "url": "https://resize.abcradio.net.au/1BvemMryapkiy1s2XV4UW71NcLY=/340x340/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 340,
              "height": 340,
              "aspect_ratio": "1x1"
            },
            {
              "url": "https://resize.abcradio.net.au/iMOnYjemnZ1ph0OSUgvn3202_Zw=/580x580/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 580,
              "height": 580,
              "aspect_ratio": "1x1"
            },
            {
              "url": "https://resize.abcradio.net.au/aTPB_eyQqO10dnrl3ftO_L9npT4=/940x940/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 940,
              "height": 940,
              "aspect_ratio": "1x1"
            },
            {
              "url": "https://resize.abcradio.net.au/pkiG4N0xGJyKakV2XfW7SJa9TXU=/100x75/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 100,
              "height": 75,
              "aspect_ratio": "4x3"
            },
            {
              "url": "https://resize.abcradio.net.au/XSnSE8GxfSyHpL3emiEfNDD90I0=/160x120/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 160,
              "height": 120,
              "aspect_ratio": "4x3"
            },
            {
              "url": "https://resize.abcradio.net.au/CSRv21kyzRIx_StNXFmHpsnesvg=/220x124/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 220,
              "height": 124,
              "aspect_ratio": "16x9"
            },
            {
              "url": "https://resize.abcradio.net.au/LSTrhFInGXYbap1eruXRzuM7nWs=/580x326/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 580,
              "height": 326,
              "aspect_ratio": "16x9"
            },
            {
              "url": "https://resize.abcradio.net.au/FGKleTgypSZVmEC_K7W7BSukjjQ=/940x529/center/middle/https%3A%2F%2Fwww.abc.net.au%2Ftriplej%2Falbums%2Fballparkmusic-pleasedontmovetomelbournesingle.jpg",
              "width": 940,
              "height": 529,
              "aspect_ratio": "16x9"
            }
          ],
          "is_primary": null
        }
      ],
      "links": [],
      "artists": [
        {
          "entity": "Artist",
          "arid": "mamQeORVY1",
          "name": "Ball Park Music",
          "artwork": [],
          "links": [
            {
              "entity": "Link",
              "arid": "mlGyQap4yD",
              "url": "https://www.abc.net.au/triplejunearthed/artist/ball-park-music/",
              "id_component": "62036",
              "title": "Unearthed artist",
              "mini_synopsis": null,
              "short_synopsis": null,
              "medium_synopsis": null,
              "type": "service",
              "provider": "unearthed",
              "external": false
            }
          ],
          "is_australian": null,
          "type": "primary",
          "role": null
        }
      ],
      "record_label": null,
      "release_year": "2025",
      "release_album_id": null
    }
  };

const song = await parse(data);
const post = await compose(song, config);

console.log(JSON.stringify(post, null, 2));

