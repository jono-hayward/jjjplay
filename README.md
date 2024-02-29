# JJJPlays

This is a wholly unofficial and unauthorised recreation of the old TripleJPlays account from the bird site. Triple J stopped maintaining those accounts in 2021, and I've been missing it ever since. I always wanted to build a new version myself, but then Elon Musk happened and I had to get away from the bird site.

Now I'm very pleased to unveil my rebuilt version for Bluesky.

This version is even an improvement over the old official one. Better text formatting, links to the song on streaming services, even album art. _Hot._

## Tech

The only dependencies I'm running:
- [ATProto API](https://github.com/bluesky-social/atproto)
- [Dotenv](https://github.com/motdotla/dotenv)
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- [youtube-music-api](https://github.com/emresenyuva/youtube-music-api)

## Known issues
- [x] ~Facet detection can get wonky when the post text contains emoji or other special characters~
- [ ] The GitHub Actions workflow is supposed to run every two minutes, but is happening much less often than that due to free account low-priority-ness.

## Roadmap?
- [ ] Currently just running one bot for the live Triple J feed on the east coast. I want to add bots for the other timezones, and Double J etc.
- [ ] I'd like to expand this to also work on Mastodon and maybe even Threads.

## License
[MIT](https://choosealicense.com/licenses/mit/)
