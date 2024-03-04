# JJJPlays

This is a wholly unofficial and unauthorised recreation of the old TripleJPlays account from the bird site. Triple J stopped maintaining that account in 2021, and I've been missing it ever since. 

Now I'm entirely chuffed to unveil my rebuilt version for Bluesky! Aside from just posting the songs that Triple J plays, it offers a few improvements over the old version: Better formatting, links streaming services, even album art. _Hot._

## How it works
Every five minutes, a Github Actions workflow queries the ABC's player API and grabs a list of all the songs that have played since the last run. It then searches for each song on streaming services (Apple Music, Spotify and YouTube Music), then compiles a Bluesky post with the song's details, artwork and streaming links.

## Tech
- [ATProto API](https://github.com/bluesky-social/atproto)
- [Dotenv](https://github.com/motdotla/dotenv)
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- [youtube-music-api](https://github.com/emresenyuva/youtube-music-api)

## Known issues
- [x] ~The links to streaming services can get a bit wonky when the post text contains emoji or other special characters~
- [x] ~The GitHub Actions workflow is supposed to run every two minutes, but is happening much less often than that due to free account low-priority-ness. I may look at rewriting this to run less often (e.g. every ten minutes) but then post all the songs from that time period. It won't update as regularly, but thanks to the `createdAt` property, the posts will still appear at the same times the songs started.~
- [ ] This depends on the internal API used by the ABC's live radio players. It updates regularly, but doesn't always show song details for whatever reason. Usually late at night it'll just stop giving any song info at all. Not much I can do about that sadly.

## Roadmap?
- [ ] Add bots for Triple J in the other Australian time zones
- [ ] Add bots for other stations like Double J, Triple J Hottest etc
- [ ] Post to Mastodon and Threads
- [ ] Add other streaming services

## Who am I?

I'm just an aging (I think the technical term is _geriatric_) millenial who has aged out of the Triple J demographic but still clings to my love of fresh tunes. Doing my part to keep spreading the love of Aussie music and Australia's greatest radio station.

![](https://media1.tenor.com/m/-u-xaJEqtfEAAAAC/nounsdao-nounish.gif)

## License
[MIT](https://choosealicense.com/licenses/mit/)
