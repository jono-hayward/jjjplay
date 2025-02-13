import { searchAppleMusic, searchSpotify, searchYouTube, searchGenius } from "./helpers.js";

const search = {
  title: "Eat Sleep Fuck Forever",
  artist: "Love Fame Tragedy",
}; 

console.table([
  {
    Service: "Apple Music",
    Result: await searchAppleMusic(search, true),
  },
  {
    Service: "Spotify",
    Result: await searchSpotify(search, true),
  },
  {
    Service: "YouTube Music",
    Result: await searchYouTube(search, true),
  },
  {
    Service: "Genius",
    Result: await searchGenius(search, true),
  },
]);
