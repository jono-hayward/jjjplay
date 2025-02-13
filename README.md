# JJJPlays

This is a wholly unofficial and unauthorised recreation of the old TripleJPlays account from the bird site. Triple J stopped maintaining that account in 2021, and I've been missing it ever since. 

Now I'm entirely chuffed to unveil my rebuilt version for Bluesky! It creates a post for every song played on Triple J, just like this old one. But it offers a few improvements over the old version: Better formatting, links to the song streaming services, links to the song lyrics, even album art. _Hot._

## How it works
Every five minutes, a Github Actions workflow queries the ABC's player API and grabs a list of all the songs that have played since the last run. It then searches for each song on streaming services (Apple Music, Spotify and YouTube Music), then compiles a Bluesky post with the song's details, artwork and streaming links.

## Tech
- [ATProto API](https://github.com/bluesky-social/atproto)
- [Dotenv](https://github.com/motdotla/dotenv)
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- [youtube-music-api](https://github.com/emresenyuva/youtube-music-api)

## Known issues
- [ ] This depends on the internal API used by the ABC's live radio players. It updates regularly, but doesn't always show song details for whatever reason. Usually late at night it'll just stop giving any song info at all. Not much I can do about that sadly.

## Roadmap?
- [x] Add bots for other stations like Double J, Triple J Hottest etc
- [ ] Post to Mastodon and Threads
- [x] Add lyrics
- [x] Add tags to artist social profiles
- [ ] Add other streaming services

## Who am I?

I'm just an aging (I think the technical term is _geriatric_) millenial who has aged out of the Triple J demographic but still clings to my love of fresh tunes. Doing my part to keep spreading the love of Aussie music and Australia's greatest radio station.

![](https://media1.tenor.com/m/-u-xaJEqtfEAAAAC/nounsdao-nounish.gif)

## License
[MIT](https://choosealicense.com/licenses/mit/)
