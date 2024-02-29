# JJJPlays

This is a wholly unofficial and unauthorised recreation of the old TripleJPlays account from the bird site. Triple J stopped maintaining that account in 2021, and I've been missing it ever since. I always wanted to build a new version myself, but then Elon Musk bought Twitter and I lost all interest in making anything for it, ever.

Now I'm very pleased to unveil my rebuilt version for Bluesky! Aside from just posting the songs that Triple J plays, it offers a few improvements over the old version: Better formatting, links to the song on streaming services, even album art. _Hot._

## Tech

The only dependencies I'm running:
- [ATProto API](https://github.com/bluesky-social/atproto)
- [Dotenv](https://github.com/motdotla/dotenv)
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- [youtube-music-api](https://github.com/emresenyuva/youtube-music-api)

## Known issues
- [x] ~The links to streaming services can get a bit wonky when the post text contains emoji or other special characters~
- [ ] The GitHub Actions workflow is supposed to run every two minutes, but is happening much less often than that due to free account low-priority-ness.
- [ ] This depends on the internal API used by the ABC's live radio players. It updates regularly, but doesn't always show song details for whatever reason. Usually late at night it'll just stop giving any song info at all. Not much I can do about that sadly.

## Roadmap?
- [ ] Spin up bots for Triple J in the other Australian time zones.
- [ ] Spin up bots for Double J etc.
- [ ] I'd like to expand this to also work on Mastodon and maybe even Threads.

## License
[MIT](https://choosealicense.com/licenses/mit/)
